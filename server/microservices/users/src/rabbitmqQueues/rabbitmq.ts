import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import client, { Channel, Connection } from 'amqplib';
import { config } from '@users/config';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'usersRabbitMQConnection', 'debug');

export async function createConnection():Promise<Channel | undefined> {
    try{
        const connection:Connection = await client.connect(`${config.RABBITMQ_AMQP_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Users service connected to RabbitMQ successfully');
        return channel;
    }
    catch(error){
        log.log('error', 'Users service RabbitMQ connection failed: ', error);
        return undefined;
    }
}