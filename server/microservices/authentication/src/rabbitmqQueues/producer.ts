import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel} from 'amqplib';
import { config } from '@authentication/config';
import { createConnection } from "@authentication/rabbitmqQueues/rabbitmq";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationRabbitMQProducer', 'debug');

export async function publishMessage(channel:Channel, exchangeName:string, routingKey:string, logMessage:string, message:string):Promise<void> {
    try{
        if(!channel){
            channel = await createConnection() as Channel;
        }   
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        channel.publish(exchangeName, routingKey, Buffer.from(message),{
            persistent: true, //Message survives RabbitMQ restarts
        });
        log.info(`Authentication service: ${logMessage}`);
    }
    catch(error){
        log.log("error", "AuthenticationService publishMessage failed!");
    }
}