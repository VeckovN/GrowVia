import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@order/config';
import { placePendingOrder } from '@order/services/order';
// import { createCustomer } from "@order/services/customer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConsumer', 'debug');

// Persistent Queue with "TTL + Requeue"
//Durable and Persistent -> the message is stored in RabbitMQ even if the User Service is down.
//durable and persist is set on publish message -> ack must be sent after processing

//WHEN THE PAYMENT(strip) SELECTED
//when customer requires order, the order is staring create with payment intent
const placeOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    
    try{
        //consumer is Payment Service on getting 'order.created' message 
        //(when customer request order but farmer hasn't approved yet)
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const orderPaymentQueue = channel.assertQueue(queueName, {durable: true});
        // const orderPaymentQueue = channel.assertQueue(queueName, {
        //     durable: true,
        //     arguments: {
        //         "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
        //         "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
        //         "x-dead-letter-routing-key": routingKey, // Send back to same queue
        //     }
        
        // });
        await channel.bindQueue((await orderPaymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await orderPaymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                // const {type, data} = JSON.parse(msg!.content.toString());
                const { type, data } = JSON.parse(msg!.content.toString());
                
                //wait on payment token (used to create order -> persist in DB)
                if(type == 'paymentTokenized') {
                    //put paymentToken in new created order (order_ID)
                    await placePendingOrder(data);
                    //we can check does data fits the orderDocuement
                    channel.ack(msg!); //Ack after successful processing 
                }
            }
            catch(error){
                log.log("error", "User Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Users service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Users service customerDirectConsumer failed: ", error);
    }
}


//on farmer accept the payment is starting processing (the captured payment is starting )
//this order consume(listen) for payment response (succeessed, rejected)
const farmerAcceptOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        //Consumer is Payment Service on 'order.accepted' 
        //The payment process has started, this listen on payment result of captured payment
        const exchangeName = 'accept-order-payment-customer';
        const queueName = 'accept-order-payment-customer-queue';
        const routingKey = 'accept-order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const farmerAcceptQueue = channel.assertQueue(queueName, {durable: true});

        // const farmerAcceptQueue = channel.assertQueue(queueName, {
        //     durable: true,
        //     arguments: {
        //         "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
        //         "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
        //         "x-dead-letter-routing-key": routingKey, // Send back to same queue
        //     }
        
        // });
        await channel.bindQueue((await farmerAcceptQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await farmerAcceptQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                if(type == 'paymentSuccess'){            
                    console.log("\n Order place Data: ", data);
                    // await createCustomer(data); //from Service
                    //Change order status to "accpeted"
                    //publish message to Notification
                    //
                    
                    log.info("User Service Data recieved from Authentication service");
                }

                if (type == 'paymentFailed'){
                    //Change order status to "Payment Failed" 
                    //Cancel the order
                    //publish message to Notification Service (notify both users)
                }

                channel.ack(msg!); //Ack after successful processing 
            }
            catch(error){
                log.log("error", "User Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Users service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Users service customerDirectConsumer failed: ", error);
    }
}

// const farmerDirectConsumer = async (channel:Channel):Promise<void> =>{
//     //consume from Authentication -> on signup(create farmer with additional info 
//     //consume from Order -> on create order, accept order, cancel order (when customer do)
// }
export {
    placeOrderPaymentDirectConsumer,
    farmerAcceptOrderPaymentDirectConsumer
}