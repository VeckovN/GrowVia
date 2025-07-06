import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@product/config';
import { decreaseProductStock, updateUserProductData } from "@product/services/product";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productRabbitMQConsumer', 'debug');

export const decreseProductsOrderDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        //consumer is Payment Service on getting 'order.created' message 
        const exchangeName = 'decrease-ordered-product';
        const queueName = 'decrease-ordered-product-queue';
        const routingKey = 'decrease-ordered-product-key'
  
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const orderProductQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await orderProductQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await orderProductQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                const { data } = JSON.parse(msg!.content.toString());
                
                console.log("Product Service data: ", data);
                const newUpdatedProducts = await decreaseProductStock(data);
                console.log("New Updated Product: ", newUpdatedProducts);

                channel.ack(msg!);
            }
            catch(error){
                log.log("error", "Product Service error processing message:", error);
                // channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Product service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Product Service decreseProductsOrder failed: ", error);
    }
}

//on User profile 'farmName', 'location' update 
export const updateUserDataDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        //consumer is Payment Service on getting 'order.created' message 
        const exchangeName = 'user-update-profile-product';
        const queueName = 'user-update-profile-product-queue';
        const routingKey = 'user-update-profile-product-key'
  
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const userProductQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await userProductQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await userProductQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                const { data } = JSON.parse(msg!.content.toString());    
                await updateUserProductData(data);
                channel.ack(msg!);
            }
            catch(error){
                log.log("error", "Product Service error processing message:", error);
                // channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Product service updateUserData consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Product service updateUserDataDirectConsumer failed: ", error);
    }
}