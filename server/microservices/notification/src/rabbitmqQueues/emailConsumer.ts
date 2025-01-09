import { winstonLogger } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';

const log:Logger = winstonLogger('http://localhost:9200', 'notificationRabbitMQConnection', 'debug');

//passed created channel (from rabbitmq.ts connection )
async function AuthEmailConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'auth-email-notification';
        const queueName = 'auth-email-queue';
        const routingKey = 'auth-email-key'
        //Asserts an exchange into existence (set direct)
        await channel.assertExchange(exchangeName, 'direct');
        const authEmailQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await authEmailQueue).queue, exchangeName,  routingKey);        

        //Without the !, TypeScript would raise an error because msg might be null, and accessing msg.content could result in a runtime error.
        //By using msg!, you're essentially telling TypeScript:
        //"I am certain that msg is not null here, so let me access msg.content without complaining.
        channel.consume((await authEmailQueue).queue, async (msg: ConsumeMessage | null)=>{
            console.log(JSON.parse(msg!.content.toString()));
            //send emails
            channel.ack(msg!);
        });
        log.info(`Notification service emailConsumer initialized`);
    }
    catch(error){
        log.log('error', "Notification service AuthEmailConsumer failed: ", error);
    }
}

async function OrderEmailConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'order-email-notification';
        const queueName = 'order-email-queue';
        const routingKey = 'order-email-key'
        await channel.assertExchange(exchangeName, 'direct');
        const orderEmailQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await orderEmailQueue).queue, exchangeName,  routingKey);        

        channel.consume((await orderEmailQueue).queue, async (msg: ConsumeMessage | null)=>{
            console.log(JSON.parse(msg!.content.toString()));
            //send emails
            channel.ack(msg!);
        });
        log.info(`Notification service orderConsumer initialized`);
    }
    catch(error){
        log.log('error', "Notification service OrderEmailConsumer failed: ", error);
    }
}

async function PaymentEmailConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'payment-email-notification';
        const queueName = 'payment-email-queue';
        const routingKey = 'payment-email-key'
        await channel.assertExchange(exchangeName, 'direct');
        const paymentEmailQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await paymentEmailQueue).queue, exchangeName,  routingKey);        

        channel.consume((await paymentEmailQueue).queue, async (msg: ConsumeMessage | null)=>{
            console.log(JSON.parse(msg!.content.toString()));
            //send emails
            channel.ack(msg!);
        });
        log.info(`Notification service paymentConsumer initialized`);
    }
    catch(error){
        log.log('error', "Notification service PaymentEmailConsumer failed: ", error);
    }
}

export { AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer }