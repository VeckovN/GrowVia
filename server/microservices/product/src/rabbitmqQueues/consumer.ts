import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@product/config';
import { decreaseProductStock, revertProductStock, updateUserProductData } from "@product/services/product";
import { publishMessage } from "@product/rabbitmqQueues/producer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productRabbitMQConsumer', 'debug');

export const checkAndReserveStockConsumer = async (channel:Channel):Promise<void> => {
    try{
        const exchangeName = 'check-reserve-product-stock';
        const queueName = 'check-reserve-product-stock-queue';
        const routingKey = 'check-reserve-product-stock-key';
  
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const stockQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await stockQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await stockQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                const { data } = JSON.parse(msg!.content.toString());
                try{

                    //check on all products quantity from 'data.orderProducts' array
                    const updatedProducts = await decreaseProductStock(data.orderItems);

                    log.info(`New Updated Products after stock decresing:\n ${updatedProducts} `)
                    log.info(`Stock successfully reserved for order: ${data.order_id}`);
                
                    //SUCCESS - Publish back to Order Service
                    await publishMessage(
                        channel,
                        'stock-reservation-result',
                        'stock-reservation-result-key',
                        `Stock reserved successfully for order: ${data.order_id}`,
                        JSON.stringify({
                            type: 'stockReserved',
                            success: true,
                            data: data
                        })
                    );
                }
                catch(stockError){
                    log.log("error", `Stock reservation failed for order ${data.order_id}`);
            
                    await publishMessage(
                        channel,
                        'stock-reservation-result',
                        'stock-reservation-result-key',
                        `Stock reservation failed for order: ${data.order_id}`,
                        JSON.stringify({
                            type: 'stockReservationFailed',
                            success: false,
                            data:data
                        })
                    );

                }

                channel.ack(msg!);
            }
            catch(error){
                log.log("error", "Product Service error processing message:", error);
                // channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            
                // Send failure message even on system error
                try {
                    const { data } = JSON.parse(msg!.content.toString());
                    await publishMessage(
                        channel,
                        'stock-reservation-result',
                        'stock-reservation-result-key',
                        `System error during stock check for order: ${data.orderID}`,
                        JSON.stringify({
                            type: 'stockReservationFailed',
                            success: false,
                            data: data
                        })
                    );
                } catch (publishError) {
                    log.log("error", "Failed to publish error message:", publishError);
                }

                channel.ack(msg); // Don't requeue - order should fail
            }   
        });
        log.info(`Product service customer consumer initialized`);
    }
    catch(error){
        log?.log('error', "Product Service decreseProductsOrder failed: ", error);
    }
}

//on any stockReserve error turn stock back on old state (before stock decresed )
export const revertProductStockConsumer = async (channel: Channel): Promise<void> => {
    try {
        const exchangeName = 'revert-product-stock';
        const queueName = 'revert-product-stock-queue';
        const routingKey = 'revert-product-stock-key';

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const revertQueue = await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(revertQueue.queue, exchangeName, routingKey);

        channel.consume(revertQueue.queue, async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            
            try {
                const { orderItems, reason, orderID } = JSON.parse(msg.content.toString());
                
                log.info(`Reverting stock for order ${orderID}. Reason: ${reason}`);
                await revertProductStock(orderItems);
                log.info(`Stock successfully reverted for order: ${orderID}`);

                channel.ack(msg);
            } catch (error) {
                log.log("error", "Product Service stock revert failed:", error);
                channel.nack(msg, false, true); // Requeue for retry
            }
        });

        log.info(`Product service stock revert consumer initialized`);
    } catch (error) {
        log?.log('error', "Product service revertProductStockConsumer failed: ", error);
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
        log?.log('error', "Product service updateUserDataDirectConsumer failed: ", error);
    }
}


