import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel} from 'amqplib';
import { config } from '@product/config';
import { createConnection } from "@product/rabbitmqQueues/rabbitmq";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productRabbitMQProducer', 'debug');

export async function publishMessage(channel:Channel, exchangeName:string, routingKey:string, logMessage:string, message:string):Promise<void> {
    try{
        if(!channel){
            channel = await createConnection() as Channel;
        }   
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        channel.publish(exchangeName, routingKey, Buffer.from(message),{
            persistent: true,
        });
        log.info(`Product service: ${logMessage}`);
    }
    catch(error){
        log.log("error", "Product Service publishMessage failed!");
    }
}