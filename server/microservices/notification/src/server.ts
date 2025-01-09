import { winstonLogger } from "@veckovn/growvia-shared";
import http from 'http';
import { Application } from 'express';
import { Logger } from "winston";
import {healthRoute} from "@notification/routes";
import { checkConnection } from "@notification/elasticsearch";
import { createConnection } from "@notification/rabbitmqQueues/rabbitmq";
import { Channel } from "amqplib";
import { AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer } from "./rabbitmqQueues/emailConsumer";

const Server_port = 4001;
// elasticSearch Url from .dev
const log: Logger = winstonLogger('http://localhost:9200', 'notificationService', 'debug');

export function start(app: Application):void {
    startServer(app);
    checkConnection();
    //the only route that isn;t passed through API Gataway(used for checking status of this service)
    app.use('', healthRoute());
    //rabbitMQ queue connection
    startQueues();
}

async function startQueues(): Promise<void>{
    //create channel for AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer
    const emailChannel:Channel = await createConnection() as Channel;
    await AuthEmailConsumer(emailChannel);
    await OrderEmailConsumer(emailChannel);
    await PaymentEmailConsumer(emailChannel);

    await publishMessages(emailChannel);
}

async function publishMessages(channel: Channel): Promise<void>{
    //publish some test messages (ofc to exchanger)
    const authEmailExchangeName = 'auth-email-notification';
    const authEmailRoutingKey = 'auth-email-key';
    await channel.assertExchange(authEmailExchangeName, 'direct');
    const message = JSON.stringify({name:"growvia", service:"notification", context:"Test auth message"})
    channel.publish(authEmailExchangeName, authEmailRoutingKey, Buffer.from(message));

    const orderEmailExchangeName = 'order-email-notification';
    const orderEmailRoutingKey = 'order-email-key';
    await channel.assertExchange(orderEmailExchangeName, 'direct');
    const messageOrder = JSON.stringify({name:"growvia", service:"notification", context:"Test order message"})
    channel.publish(orderEmailExchangeName, orderEmailRoutingKey, Buffer.from(messageOrder));
    
    const paymentEmailExchangeName = 'payment-email-notification';
    const paymentEmailRoutingKey = 'payment-email-key';
    await channel.assertExchange(orderEmailExchangeName, 'direct');
    const messagePayment = JSON.stringify({name:"growvia", service:"notification", context:"Test payment message"})
    channel.publish(paymentEmailExchangeName, paymentEmailRoutingKey, Buffer.from(messagePayment));
}

function startServer(app: Application):void {
    try{
        const server: http.Server = new http.Server(app);
        log.info(`Notification service starting, process ID:${process.pid}`);
        server.listen(Server_port, () =>{
            log.info(`Notification service is running on port: ${Server_port}`);
        })
    }
    catch (err){
        log.log('error', 'Notification service running error ', err);
    }
   
    // app.listen(Server_port, ()=>{
    //     console.log(`Notification service is running on port: ${Server_port}`);
    // })
}
