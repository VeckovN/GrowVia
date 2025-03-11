import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@payment/config';
import { publishMessage } from "@payment/rabbitmqQueues/producer";
// import { createCustomer } from "@Payment/services/customer";
// import { createFarmer } from "@Payment/services/farmer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'paymentRabbitMQConsumer', 'debug');

//customer requested order (order created) and payment should be capture -> before farmer accept it
const orderPendingDirectConsumer = async (channel:Channel):Promise<void> => {
    ///consume from Authentication (on signup)
    try{
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
    
        const authUserQueue = channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
                "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
                "x-dead-letter-routing-key": routingKey, // Send back to same queue
            }
        
        });
        await channel.bindQueue((await authUserQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await authUserQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                if(type == 'orderCreated'){  
                    //take Tokenize card data & store intent in Stripe      
                    console.log("\n Order data: ", data);
                    // await createCustomer(data); //from Service
                    log.info("Payment Service Data recieved from Order Serivce");

                    //Simulating tokenization (for test)
                    const paymentToken = `token_${Date.now()}`;
                    const MessageType = "paymentTokenized";
                    const updatedData = { ...data, paymentToken };

                    //Returns Payment Token to Order Service (via consumer)
                    await publishMessage(
                        channel,
                        exchangeName,
                        routingKey,
                        'Payment token created and sent back to Order - Customer Request',
                        JSON.stringify({ type: MessageType, data: updatedData })
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
        log?.log('error', "Payment service customerDirectConsumer failed: ", error);
    }
}


//when farmer accept the order the payment process is starting (from captured state to withdrawing money)
const farmerAccpetDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
    
        const authUserQueue = channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
                "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
                "x-dead-letter-routing-key": routingKey, // Send back to same queue
            }
        
        });
        await channel.bindQueue((await authUserQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await authUserQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                let MessageType = '';
                let updatedData = {};

                if(type == 'orderAccepted'){     
                    console.log("\n Order data: ", data);
                    log.info("Payment Service Data recieved from Order Serivce");

                    //start (strip) paymeny proces ()
                    try{
                        //await stripe something:
                        // const stripReturnData =  await doPayment();
                        const stripReturnData = ''
                        updatedData = { ...data, stripReturnData };
                        MessageType = "paymentSucceess";

                    }
                    catch(error){
                        log.log("error", "Payment service the stripe payment failed: ", error);
                        MessageType = "paymentFailed"; //Order service will cancel order 
 
                        //Payment failed than -> Cancels the payment intent (refund if captured).   
                    }

                    //Returns Payment Token to Order Service (via consumer)
                    await publishMessage(
                        channel,
                        exchangeName,
                        routingKey,
                        'Payment stipe result return forward back to Order - Farmer Accept',
                        JSON.stringify({ type: MessageType, data: updatedData })
                    );

                    log.info("Payment Service payment Token forward back to Order Serivce");
                }

                if(type == 'orderRejected'){  
                    MessageType = "paymentRejacted"

                    //Cancels the payment intent (refunds if already captured).

                    await publishMessage(
                        channel,
                        exchangeName,
                        routingKey,
                        'Payment stipe result return forward back to Order - Farmer Accept',
                        JSON.stringify({ type: MessageType, data: updatedData })
                    );

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
        log?.log('error', "Payment service customerDirectConsumer failed: ", error);
    }
}


export {
    orderPendingDirectConsumer,
    farmerAccpetDirectConsumer
}