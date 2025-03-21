import { OrderDocumentInterface, OrderEmailMessageInterface } from '@veckovn/growvia-shared';
import { publishMessage } from '@order/rabbitmqQueues/producer';
import { Channel } from "amqplib";
import { Server } from 'socket.io';

interface OrderNotificationInterface {
    //automatically on create not on post
    id?: string; //id type of Notification Service DB
    orderID: string;
    senderID: string; //of can be get throught session -> currentUser.id
    senderUsername: string;
    receiverID: string; 
    receiverUsername: string;
    message: string;
    isRead?: boolean;
    type?: string;
    createdAt?: Date;
}

//just notification without sending email
//'order-email-notification',
//'order-email-key',
export const postOrderNotification = async (
    orderChannel: Channel,
    orderSocketIO: Server, 
    logMessage: string,
    order: OrderDocumentInterface, 
    notification: OrderNotificationInterface
) => {
// export const postOrderNotification = (orderChannel: Channel, orderSocketIO: Server, notificationData:notificationMessage, order: OrderDocumentInterface, notification: OrderNotificationInterface) =>{
    await publishMessage( //sending to Notification service that will be stored in 
        orderChannel,
        'order-notification',
        'order-notification-key',
        logMessage,
        JSON.stringify({order, notification})
    )
    
    orderSocketIO.emit("order-notify", order, notification);
}

//send notification to Notification service with email exhanger and key
// 'order-email-notification',
//'order-email-key',
export const postOrderNotificationWithEmail = async (
    orderChannel: Channel,
    orderSocketIO: Server,
    emailMessage: OrderEmailMessageInterface,
    logMessage: string,
    order: OrderDocumentInterface,
    notification: OrderNotificationInterface,

) => {
        //post to email (there will be stored in Notification DB and email sent)
        await publishMessage(
            orderChannel,
            'order-email-notification',
            'order-email-key',
            logMessage,
            JSON.stringify(emailMessage)
        )

        orderSocketIO.emit("order-notify", order, notification);
}   