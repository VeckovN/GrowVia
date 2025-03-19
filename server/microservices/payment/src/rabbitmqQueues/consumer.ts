import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@payment/config';
import { publishMessage } from "@payment/rabbitmqQueues/producer";
// import { createCustomer } from "@Payment/services/customer";
// import { createFarmer } from "@Payment/services/farmer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'paymentRabbitMQConsumer', 'debug');

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
                    //take Tokenize card data & store intent in Stripe      
                    console.log("\n Order data received: ", data);
                    log.info("Payment Service Data recieved from Order Serivce");

                    //Simulating tokenization (for test)
                    const paymentToken = `token_${Date.now()}`;
                    const updatedData = { ...data, payment_token: paymentToken }; //override paymentToken props
                    //As well add payment_intent_id

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