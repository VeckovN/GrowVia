import { winstonLogger, OrderEmailMessageInterface, NotificationInterface, NotFoundError } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@order/config';
import { placePendingOrder, changeOrderStatus} from '@order/services/order';
import { orderChannel } from '@order/server';
import { orderSocketIO } from "@order/server";
import { postOrderNotificationWithEmail } from "@order/helper";
import { publishMessage } from "@order/rabbitmqQueues/producer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConsumer', 'debug');

//triggered on farmerApproveOrder service action, and waiting response from Product service on stockDecrease action
const stockReservationResultConsumer = async (channel:Channel):Promise<void> => {
    try{
        const exchangeName = 'stock-reservation-result';
        const queueName = 'stock-reservation-result-queue';
        const routingKey = 'stock-reservation-result-key';

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const resultQueue = await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(resultQueue.queue, exchangeName, routingKey);

        channel.consume(resultQueue.queue, async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            try {
                const { type, success, data } = JSON.parse(msg!.content.toString());
                const orderID = data.order_id;

                if(type === 'stockReserved' && success){
                    if(data.payment_type === 'stripe'){
                        //sent to Payment Service
                        await publishMessage(
                            orderChannel,
                            'accept-reject-order-payment',
                            'accept-reject-order-payment-key',
                            'Order approved data sent to the Payment service',
                            JSON.stringify({type: "orderApproved", data}),
                        );
                    }
                    else if (data.payment_type === 'cod'){
                        log.debug("stockReserved starting with 'cod' order Approving");

                        if(!orderID)
                            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService stockReservationResultConsumer with cod paymentMethod failed")
                        
                        await changeOrderStatus(data.order_id, 'accepted');
                        
                        const notificationMessage = `Your request order #${orderID.slice(0,8)}... has been approved`;

                        const emailMessage: OrderEmailMessageInterface = {
                            template: "orderApproved", //email template name 
                            type: "accepted", //panding status
                            orderUrl: `${config.CLIENT_URL}/order/track/${orderID}`,
                            orderID: orderID,
                            invoiceID: data.invoice_id,
                            receiverEmail: data.customer_email, //to the farmer (farmet got the notification)
                            farmerUsername: data.farmer_username,
                            farmerEmail: data.farmer_email,
                            customerUsername: data.customer_username,
                            totalPrice: data.total_price,
                            orderItems: data.orderItems
                        }

                        const notification: NotificationInterface = {
                            type: 'order', // must match enum in schema
                            sender: {
                                id: data.farmer_id,
                                name: data.farmer_username,
                                // farmerAvatarUrl isn't part of Order data
                                // avatarUrl: orderData?|| '', // fetch from user service / redux state
                            },
                            receiver: {
                                id: data.customer_id,
                                name: `${data.customer_first_name} ${data.customer_last_name}`.trim(),
                            },
                            message: notificationMessage,
                            isRead: false,
                            bothUsers: false, // or true if needed
                            order: {
                                orderId: orderID,
                                status: data.order_status || 'pending',
                            },
                            createdAt: new Date().toISOString()
                        };

                        const logMessage = 'Send Farmer approved - "cod" email Data to Notification service';
                        await postOrderNotificationWithEmail( 
                            orderChannel,
                            orderSocketIO,
                            emailMessage,
                            logMessage,
                            data,
                            notification
                        );
                    }

                }  
                 
                channel.ack(msg);
            }
            catch(error){
                log?.log('error', "Order service stockReservationResultConsumer failed: ", error);
                channel.nack(msg, false, true);
            }
        });
    }
    catch(error){

    }
}

//when customer requires order, the order is staring create with payment intent
const placeOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
        //consumer is Payment Service on getting 'order.created' message 
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const orderPaymentQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await orderPaymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await orderPaymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                const { type, data } = JSON.parse(msg!.content.toString());
                
                if(type == 'paymentTokenized') {
                    console.log("Order Service consumer on, type: 'paymentTokenized'")
                    await placePendingOrder(data);
                    channel.ack(msg!); //Ack after successful processing 
                }
            }
            catch(error){
                log.log("error", "Order Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Order service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Order service customerDirectConsumer failed: ", error);
    }
}

const farmerAcceptOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    try{ 
        // (trigger from) stockReservationResultConsumer on stock check availability and reserving
        const exchangeName = 'payment-order-result';
        const queueName = 'payment-order-result-queue';
        const routingKey = 'payment-order-result-key'; 

        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const farmerAcceptQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await farmerAcceptQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await farmerAcceptQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());

                //this sent on Payment service  successfull 'orderApproved' consumer
                if(type == 'ApprovePaymentSuccess'){            
                    console.log("\n Order place Data: ", data);
                    await changeOrderStatus(data.order_id, 'accepted', 'paid');

                    //publish message to Notification
                    const emailMessage: OrderEmailMessageInterface = {
                        template: "orderApproved", //email template -> to the Customer 
                        type: "accepted", //panding status
                        orderUrl: `${config.CLIENT_URL}/order/${data.order_id}`,
                        orderID: data.order_id,
                        invoiceID: data.invoice_id,
                        receiverEmail: data.customer_email, //to the Customer
                        farmerUsername: data.farmer_username,
                        customerUsername: data.customer_username,
                        totalPrice: data.total_price,
                        orderItems: data.orderItems
                    }
                    
                    const notificationMessage = `Your orderID: #${data.order_id.slice(0,8)}... approved by farmer: ${data.farmer_username}`;
                    const notification: NotificationInterface = {
                        type: 'order', // must match enum in schema
                        sender: {
                            id: data.farmer_id,
                            name: data.farmer_username,
                            // farmerAvatarUrl isn't part of Order data
                            // avatarUrl: orderData?|| '', // fetch from user service / redux state
                        },
                        receiver: {
                            id: data.customer_id,
                            name: `${data.customer_first_name} ${data.customer_last_name}`.trim(),
                        },
                        message: notificationMessage,
                        isRead: false,
                        bothUsers: false, // or true if needed
                        order: {
                            orderId: data.order_id,
                            status: data.order_status || 'pending',
                        },
                        createdAt: new Date().toISOString(),
                    };

                    const logMessage = 'Send Farmer Approve email Data to Notification service';
                    //send email and socket event
                    await postOrderNotificationWithEmail( 
                        orderChannel,
                        orderSocketIO,
                        emailMessage,
                        logMessage,
                        data,
                        notification
                    );

                    log.info("Order Service: order approved - payment succeeded message recevied");
                }

                //payment Fail on orderAccepted
                if (type == 'ApprovePaymentFailed'){
                    // await stripe.paymentIntents.cancel(data.payment_intent_id);
                    await changeOrderStatus(data.order_id, 'paymentFailed', 'canceled');
                   
                    const emailMessage: OrderEmailMessageInterface = {
                        template: "orderPaymentFailed", //email template -> to the Customer 
                        type: "paymentFailed", //panding status
                        orderUrl: `${config.CLIENT_URL}/order/${data.order_id}`,
                        orderID: data.order_id,
                        invoiceID: data.invoice_id,
                        receiverEmail: data.customer_email, //and farmer as well
                        farmerUsername: data.farmer_username,
                        farmerEmail: data.farmer_email,
                        customerUsername: data.customer_username,
                        customerEmail: data.customer_email,
                        totalPrice: data.total_price,
                        orderItems: data.orderItems,
                        bothUsers: true
                    }

                    const notificationMessage = `Your payment failed on order: #${data.order_id.slice(0,8)}...`;
                    const notification: NotificationInterface = {
                        type: 'order', // must match enum in schema
                        sender: {
                            id: data.farmer_id,
                            name: data.farmer_username,
                            // farmerAvatarUrl isn't part of Order data
                            // avatarUrl: orderData?|| '', // fetch from user service / redux state
                        },
                        receiver: {
                            id: data.customer_id,
                            name: `${data.customer_first_name} ${data.customer_last_name}`.trim(),
                        },
                        message: notificationMessage,
                        isRead: false,
                        bothUsers: false, // or true if needed
                        order: {
                            orderId: data.order_id,
                            status: data.order_status || 'pending',
                        },
                        createdAt: new Date().toISOString(),
                    };
            
                    const logMessage = 'Send Order Reject to users email data to Notification service';
                    //send email and socket event
                    await postOrderNotificationWithEmail( 
                        orderChannel,
                        orderSocketIO,
                        emailMessage,
                        logMessage,
                        data,
                        notification
                    );

                    // log.info("Order Service: order approved - payment succeeded message recevied");
                }

                if (type == 'paymentCanceled'){;
                    await changeOrderStatus(data.order_id, "canceled", "canceled");

                    const emailMessage: OrderEmailMessageInterface = {
                        template: "orderCanceled", //email template -> to the Customer 
                        type: "canceled", 
                        orderUrl: `${config.CLIENT_URL}/order/${data.order_id}`,
                        orderID: data.order_id,
                        invoiceID: data.invoice_id,
                        receiverEmail: data.customer_email, //to the Customer
                        farmerUsername: data.farmer_username,
                        customerUsername: data.customer_username,
                        totalPrice: data.total_price,
                        orderItems: data.orderItems
                    }

                    const notificationMessage = `Your requested order has canceled by: ${data.farmer_username}`
                    const notification: NotificationInterface = {
                        type: 'order', // must match enum in schema
                        sender: {
                            id: data.farmer_id,
                            name: data.farmer_username,
                            // farmerAvatarUrl isn't part of Order data
                            // avatarUrl: orderData?|| '', // fetch from user service / redux state
                        },
                        receiver: {
                            id: data.customer_id,
                            name: `${data.customer_first_name} ${data.customer_last_name}`.trim(),
                        },
                        message: notificationMessage,
                        isRead: false,
                        bothUsers: false, // or true if needed
                        order: {
                            orderId: data.order_id,
                            status: data.order_status || 'pending',
                        },
                        createdAt: new Date().toISOString(),
                    };

                    const logMessage = 'Send Order Cancel email to Notification service';
                    //send email and socket event
                    await postOrderNotificationWithEmail( 
                        orderChannel,
                        orderSocketIO,
                        emailMessage,
                        logMessage,
                        data,
                        notification
                    );
                    
                }

                channel.ack(msg!); //Ack after successful processing 
            }
            catch(error){
                log.log("error", "Order Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Order service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Order service customerDirectConsumer failed: ", error);
    }
}

export {
    stockReservationResultConsumer,
    placeOrderPaymentDirectConsumer,
    farmerAcceptOrderPaymentDirectConsumer
}