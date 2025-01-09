import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import client, { Channel, Connection } from 'amqplib';

const log:Logger = winstonLogger('http://localhost:9200', 'notificationRabbitMQConnection', 'debug');

export async function createConnection():Promise<Channel | null> {
    try{
        const connection:Connection = await client.connect('amqp://growvia:growviapassword@localhost:5672');
        const channel: Channel = await connection.createChannel();
        log.info('Notification service connected to RabbitMQ successfully');
        return channel;
    }
    catch(error){
        log.log('error', 'Notification service RabbitMQ connection failed: ', error);
        return null;
    }
}
