import { winstonLogger, EmailLocalsInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { sendEmail } from "@notification/rabbitmqQueues/emailTransport";
import { config } from '@notification/config';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationRabbitMQConnection', 'debug');

async function AuthEmailConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'auth-email-notification';
        const queueName = 'auth-email-queue';
        const routingKey = 'auth-email-key'
        //Asserts an exchange into existence (set direct)
        await channel.assertExchange(exchangeName, 'direct');
        const authEmailQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await authEmailQueue).queue, exchangeName,  routingKey);        

        channel.consume((await authEmailQueue).queue, async (msg: ConsumeMessage | null)=>{
            //msg! garante that msg is not null or undefined
            const {template, receiverEmail, username, verifyLink, resetLink} = JSON.parse(msg!.content.toString());
            
            const locals: EmailLocalsInterface = {
                // appLink: `${config.CLIENT_URL}`, //app link is client URL (app link)
                username,
                verifyLink,
                resetLink
            };
            //different auth emails-templates (forgotPassword, resetPassword verifyEmail, verifyEmailConfirm, ) 
            await sendEmail(template, receiverEmail, locals);
            //await storeNotification
            channel.ack(msg!);
        });
        log.info(`Notification service emailConsumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Notification service AuthEmailConsumer failed: ", error);
    }
}

async function OrderEmailConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'order-email-notification';
        const queueName = 'order-email-queue';
        const routingKey = 'order-email-key';
        await channel.assertExchange(exchangeName, 'direct');
        const orderEmailQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await orderEmailQueue).queue, exchangeName,  routingKey);        

        channel.consume((await orderEmailQueue).queue, async (msg: ConsumeMessage | null)=>{
            console.log("MSG:", JSON.parse(msg!.content.toString()));
            const { 
                // message,
                // type,
                template,
                orderUrl,
                orderID,
                invoiceID,
                receiverEmail,
                farmerUsername,
                farmerEmail,
                customerUsername,
                customerEmail,
                totalAmount,
                orderItems,
                bothUsers
            } = JSON.parse(msg!.content.toString());
            //temple = 'orderPlaced', ' ', ' '
            
            const locals: EmailLocalsInterface = {
                // appLink: `${config.CLIENT_URL}`, //app link is client URL (app link)
                // username,
                // verifyLink,
                // resetLink
                orderUrl,
                orderID,
                invoiceID,
                receiverEmail,
                farmerUsername,
                customerUsername,
                totalAmount,
                orderItems
            };

            console.log("")
            //send emails to both users
            if(bothUsers){
                await sendEmail(template, customerEmail, locals);
                await sendEmail(template, farmerEmail, locals);
                console.log("BOTHUSERS BOOOOOOOOTHHHHH");
                //storeNotification 
            } 
            else {
                await sendEmail(template, receiverEmail, locals);
                console.log("BOTHUSERS SINGLEEEE");
                //storeNotification
            }

            channel.ack(msg!);
        });
        log.info(`Notification service orderConsumer initialized`);
    }
    catch(error){
        log.log('error', "Notification service OrderEmailConsumer failed: ", error);
    }
}

async function OrderNotificationConsumer(channel: Channel): Promise<void> {
    try{
        const exchangeName = 'order-notification';
        const queueName = 'order-notification-queue';
        const routingKey = 'order-notification-key';
        await channel.assertExchange(exchangeName, 'direct');
        const orderNotificaionQueue = channel.assertQueue(queueName, {durable: true, autoDelete:false});
        await channel.bindQueue((await orderNotificaionQueue).queue, exchangeName,  routingKey);        

        channel.consume((await orderNotificaionQueue).queue, async (msg: ConsumeMessage | null)=>{
            console.log("MSG:", JSON.parse(msg!.content.toString()));
            const { 
                // order,
                // notification
                //bothUsers
            } = JSON.parse(msg!.content.toString());

            //just store notification
            
            channel.ack(msg!);
        });
        log.info(`Notification service orderConsumer initialized`);
    }
    catch(error){
        log.log('error', "Notification service OrderEmailConsumer failed: ", error);
    }
}

//on farmer approvment the payment result must be notified (succeed, denied)
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

export { AuthEmailConsumer, OrderEmailConsumer, OrderNotificationConsumer, PaymentEmailConsumer }