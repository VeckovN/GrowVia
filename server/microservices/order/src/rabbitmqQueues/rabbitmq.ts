
import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import client, { Channel, Connection } from 'amqplib';
import { config } from '@order/config';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConnection', 'debug');

export async function createConnection():Promise<Channel | undefined> {
    try{
        const connection:Connection = await client.connect(`${config.RABBITMQ_AMQP_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Product service connected to RabbitMQ successfully');
        return channel;
    }
    catch(error){
        log.log('error', 'Product service RabbitMQ connection failed: ', error);
        return undefined;
    }
}