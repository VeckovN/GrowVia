import { winstonLogger } from "@veckovn/growvia-shared";
import Stripe from "stripe";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@payment/config';
import { publishMessage } from "@payment/rabbitmqQueues/producer";
// import { createCustomer } from "@Payment/services/customer";
// import { createFarmer } from "@Payment/services/farmer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'paymentRabbitMQConsumer', 'debug');


// const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
//     //check for apiVersion
//     apiVersion: '2023-08-16', 
// });


const stripe: Stripe = new Stripe(config.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia', 
    typescript: true
  });

//There's no need for creating customer account (intent will be created)
//in backend only createing end-point (intent not customer option)
//On Frontend Uses client_secret for confirmation
//Use payment_type to reference saved payment details (instead of tokens).

//customer requested order (order created) and payment should be capture -> before farmer accept it
const orderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    ///consume from Authentication (on signup)
    try{
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const paymentQueue = channel.assertQueue(queueName, {durable: true});

        await channel.bindQueue((await paymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await paymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                //taking data for order placing (create token and return back to the order service)
                if(type == 'orderPlaced'){      
                    console.log("\n Order data received: ", data);
            
                    // the service charge is 4% of the purchase amount, for purchases under $40, an additional $2 is applied
                    const serviceFee: number = data.total_price < 40 ? (4 / 100) * data.total_price + 2 : (4 / 100) * data.total_price;
                    const paymentIntent = await stripe.paymentIntents.create({
                        // amount: data.total_price
                        amount: Math.floor((data.total_price + serviceFee) * 100),
                        currency: 'eur',
                        //For testing use data.payment_method
                        payment_method: data.payment_method, //using only for testing
                        // payment_method: data.payment_method_id, //using only for testing
                        confirm: true, // Auto-confirms for testing
                        capture_method: 'manual', // For farmer approval flow
                        metadata: { order_id: data.order_id}
                    });

                    //Confirm payment immediately (confirm on capturing)
                    // const confirmedIntent = await stripe.paymentIntents.confirm(
                    await stripe.paymentIntents.confirm(
                        paymentIntent.id,
                        // { payment_method: 'pm_card_visa' } // Replace with actual payment method
                        { payment_method: data.payment_method } // Replace with actual payment method
                    );

                    const updatedData = { 
                        ...data, 
                        payment_intent_id: paymentIntent.id,
                        payment_method_id: data.payment_method_id,
                        payment_method: data.payment_method,
                        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                        
                    }; 
                
                    //Returns Payment Token to Order Service (via consumer)
                    await publishMessage(
                        channel,
                        exchangeName,
                        routingKey,
                        'Payment token created and sent back to Order - Customer Request',
                        JSON.stringify({ type: 'paymentTokenized', data: updatedData })
                    );

                    log.info("Payment Service payment Token forward back to Order Serivce");
                }

                log.info("Payment Service Data recieved from Order Serivce");
                channel.ack(msg!); //Ack after successful processing 
            }
            catch(error){
                log.log("error", "Payment Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Payment service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Payment service orderPaymentDirectConsumer failed: ", error);
    }
}



//when farmer accept the order the payment process is starting (from captured state to withdrawing money)
const farmerAccpetAndRejectDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        //this is used for consumer -> to receive message
        const exchangeName = 'accept-reject-order-payment';
        const queueName = 'accept-reject-order-payment-queue';
        const routingKey = 'accept-reject-order-payment-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const paymentQueue = channel.assertQueue(queueName, {durable: true});
       
        await channel.bindQueue((await paymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await paymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());

                //On farmer appove order, capture payment must be  
                if(type == 'orderApproved'){     
                    console.log("\n Order Approved data: ", data);
                    log.info("Payment Service Data recieved on farmer order approvment");

                    //Different exchange and key name for sending back the payment success ack
                    const exchangeName = 'payment-order-result';
                    const routingKey = 'payment-order-result-key';              

                    try{
                        // Capture payment using Stripe
                        //const paymentIntent = await stripe.paymentIntents.capture(data.payment_intent_id);

                        await publishMessage(
                            channel,
                            exchangeName,
                            routingKey,
                            'Payment successfully captured - Farmer Approve order',
                            JSON.stringify({ type: 'ApprovePaymentSuccess', data: data})
                        );

                        log.info("Payment Service payment succeeded, message forward back to Order Serivce");
                    }
                    catch(error){
                
                        //Payment failed than -> Cancels the payment intent (refund if captured).   
                        await publishMessage(
                            channel,
                            exchangeName,
                            routingKey,
                            'Payment stipe caputed failed forward back to Order - Farmer Approved order',
                            JSON.stringify({ type: 'ApprovePaymentFailed', data: null })
                        );

                        log.log("error", "Payment service the stripe payment failed: ", error);
                    }
                }

                if(type == 'orderCanceled'){  
                    log.info("Payment Service: payment rejected");
                    //Cancels the payment intent (refunds if already captured).
                    try{
                        //using to send back message to the order service (that expecting payment results)
                        const exchangeName = 'payment-order-result';
                        const routingKey = 'payment-order-result-key'; 

                        // Refund payment using Stripe
                        //const refund = await stripe.refunds.create({ payment_intent: data.payment_intent_id });

                        //if the stripe refund has successed
                        await publishMessage(
                            channel,
                            exchangeName,
                            routingKey,
                            'Payment rejected, payment intent canceled and refunds  ',
                            JSON.stringify({ type: 'paymentCanceled', data: data })
                        );
                        log.info("Payment Service: payment rejected");
                    }
                    catch(error){
                        //strip Refund HAVEN"T SUCCEESED
                        //handle refund failure

                        await publishMessage(
                            channel,
                            exchangeName,
                            routingKey,
                            'Payment rejected, payment intent canceled and refunds  ',
                            JSON.stringify({ type: 'paymentCanceled', data: null })
                            // JSON.stringify({ type: 'paymentRejectionFailed', data: null })
                        );

                        log.log("error", "Payment service the stripe payment refund failed: ", error);
                    }
                }

                channel.ack(msg!); //Ack after successful processing 
            }
            catch(error){
                log.log("error", "Payment Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Payment service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Payment service farmerAccpetAndRejectDirectConsumer failed: ", error);
    }
}


export {
    orderPaymentDirectConsumer,
    farmerAccpetAndRejectDirectConsumer
}