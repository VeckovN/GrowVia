import { winstonLogger, OrderEmailMessageInterface, NotificationInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@order/config';
import { placePendingOrder, changeOrderStatus} from '@order/services/order';
import { orderChannel } from '@order/server';
import { orderSocketIO } from "@order/server";
import { postOrderNotificationWithEmail } from "@order/helper";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConsumer', 'debug');

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
                    console.log("Order Service consumer on, type: 'paymentTokenized' ")
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

//on farmer accept the payment is starting processing (the captured payment is starting )
//this order consume(listen) for payment response (succeessed, rejected)
const farmerAcceptOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    try{
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
                console.log("DATA REEEEE: ", data);

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

                    const notificationMessage = `Your orderID: ${data.order_id} approved by farmer: ${data.farmer_username} `
                    const logMessage = 'Send farmer approve email data to notification service';
                    const notification: NotificationInterface = {
                        type: 'Order', 
                        orderID: data.order_id,
                        senderID: data.farmer_id,  
                        senderUsername: data.farmer_username,
                        receiverID: data.customer_id,
                        receiverUsername: data.customer_username,
                        message: notificationMessage,
                        isRead: false
                    }
            
                    console.log("Consumer ApprovePaymentSuccess Notification being sent: ", notification);

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
                    // log.info("User Service Data recieved from Authentication service");
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

                    const notificationMessage = ` Your payment failed on order: ${data.order_id} `
                    const logMessage = 'Send order reject email to users to notification service';
                    const notification: NotificationInterface = {
                        type: 'Order', 
                        orderID: data.order_id,
                        senderID: data.farmer_id,  
                        senderUsername: data.farmer_username,
                        senderEmail: data.farmer_email,
                        receiverID: data.customer_id,
                        receiverUsername: data.customer_username,
                        receiverEmail: data.customer_email,
                        message: notificationMessage,
                        isRead: false,
                        bothUsers: true
                    }

                    console.log("Consumer ApprovePatmenyFailed Notification being sent: ", notification);
            
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

                    const notificationMessage = ` Your requested order has canceled by: ${data.farmer_username} `
                    const logMessage = 'Send order cancel email to users to notification service';
                    const notification: NotificationInterface = {
                        type: 'Order', 
                        orderID: data.order_id,
                        senderID: data.farmer_id,  
                        senderUsername: data.farmer_username,
                        receiverID: data.customer_id,
                        receiverUsername: data.customer_username,
                        message: notificationMessage,
                        isRead: false
                    }

                    console.log("consumer paymentCanceled Notification being sent: ", notification);
            
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
    placeOrderPaymentDirectConsumer,
    farmerAcceptOrderPaymentDirectConsumer
}