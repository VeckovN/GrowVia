//The Auth Service sends messages(produce) to 
// "Notification Service"  - send message to notif server that will send Email and push notification 
// "User Service" - send message that's matter for user (maybe if the user changed password, or other stuffs)

import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
// import client, { Channel, Connection } from 'amqplib';
import * as amqp from 'amqplib'; 
import { config } from '@authentication/config';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationRabbitMQConnection', 'debug');

export async function createConnection():Promise<amqp.Channel | undefined> {
    try{
        const connection:amqp.Connection = await amqp.connect(`${config.RABBITMQ_AMQP_ENDPOINT}`);
        const channel: amqp.Channel = await connection.createChannel();
        log.info('Authentication service connected to RabbitMQ successfully');
        return channel;
    }
    catch(error){
        log.log('error', 'Authentication service RabbitMQ connection failed: ', error);
        return undefined;
    }
}
