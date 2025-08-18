import { OrderDocumentInterface, OrderEmailMessageInterface, NotificationInterface } from '@veckovn/growvia-shared';
import { publishMessage } from '@order/rabbitmqQueues/producer';
import { Channel } from "amqplib";
import { Server } from 'socket.io';

//just notification without sending email
export const postOrderNotification = async (
    orderChannel: Channel,
    orderSocketIO: Server, 
    logMessage: string,
    order: OrderDocumentInterface, 
    notification: NotificationInterface
) => {
    await publishMessage( //sending to Notification service that will be stored in 
        orderChannel,
        'order-notification',
        'order-notification-key',
        logMessage,
        // JSON.stringify({order, notification})
        JSON.stringify({notification})
    )

    orderSocketIO.emit("order-notify", {order, notification});
}

//send notification to Notification service with email exhanger and key
export const postOrderNotificationWithEmail = async (
    orderChannel: Channel,
    orderSocketIO: Server,
    emailMessage: OrderEmailMessageInterface,
    logMessage: string,
    order: OrderDocumentInterface,
    notification: NotificationInterface

) => {
    const payload = { 
        ...emailMessage,
        notification
    }
    //post to email (there will be stored in Notification DB and email sent)
    await publishMessage(
        orderChannel,
        'order-email-notification',
        'order-email-key',
        logMessage,
        JSON.stringify(payload)
    )

    orderSocketIO.emit("order-notify", {order, notification});
}   