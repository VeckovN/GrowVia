import { winstonLogger, OrderEmailMessageInterface, OrderNotificationInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@order/config';
// import { publishMessage } from "@order/rabbitmqQueues/producer";
import { placePendingOrder, changeOrderStatus} from '@order/services/order';
import { orderChannel } from '@order/server';
import { orderSocketIO } from "@order/server";
import { postOrderNotificationWithEmail } from "@order/helper";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConsumer', 'debug');


//WHEN THE PAYMENT(strip) SELECTED
//when customer requires order, the order is staring create with payment intent
const placeOrderPaymentDirectConsumer = async (channel:Channel):Promise<void> => {
    
    try{
        //consumer is Payment Service on getting 'order.created' message 
        //(when customer request order but farmer hasn't approved yet)
        const exchangeName = 'order-payment-customer';
        const queueName = 'order-payment-customer-queue';
        const routingKey = 'order-payment-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const orderPaymentQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await orderPaymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await orderPaymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
               
                const { type, data } = JSON.parse(msg!.content.toString());
                
                //wait on payment token (used to create order -> persist in DB)
                if(type == 'paymentTokenized') {
                    //put paymentToken in new created order (order_ID)
                    console.log("Order Service consumer on, type: 'paymentTokenized' ")
                    await placePendingOrder(data);
                    //we can check does data fits the orderDocuement
                    channel.ack(msg!); //Ack after successful processing 
                }
            }
            catch(error){
                log.log("error", "Order Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Users service customer consumer initialized`);
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

        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const farmerAcceptQueue = channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue((await farmerAcceptQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await farmerAcceptQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                console.log("DATA REEEEE: ", data);
                console.log("DATA REEEEE TYPE: ", type);

                if(type == 'ApprovePaymentSuccess'){            
                    console.log("\n Order place Data: ", data);
                    // await createCustomer(data); //from Service
                    //Change order status to "accpeted"
                    await changeOrderStatus(data.order_id, 'accepted', 'accepted');
            

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
                        totalAmount: data.total_amount,
                        orderItems: data.orderItems
                    }

                    const notificationMessage = ` Your orderID: ${data.order_id} approved by farmer: ${data.farmer_username} `
                    const logMessage = 'Send farmer approve email data to notification service';
                    const notification: OrderNotificationInterface = {
                        orderID: data,
                        senderID: data.farmer_id,  
                        senderUsername: data.farmer_username,
                        receiverID: data.customer_id,
                        receiverUsername: data.customer_username,
                        message: notificationMessage,
                        isRead: false,
                    }
            
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
                    //Change order status to "Payment Failed" 
                    await changeOrderStatus(data.order_id, 'paymentFailed');
                   
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
                        totalAmount: data.total_amount,
                        orderItems: data.orderItems,
                        bothUsers: true
                    }

                    const notificationMessage = ` Your payment failed on order: ${data.order_id} `
                    const logMessage = 'Send order reject email to users to notification service';
                    const notification: OrderNotificationInterface = {
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

                //When Farmer reject customer requested order(that is paid with stripe)
                // if (type == 'paymentRejected'){
                if (type == 'paymentCanceled'){
                    await changeOrderStatus(data.order_id, "canceled", "canceled");

                    const emailMessage: OrderEmailMessageInterface = {
                        template: "orderCanceled", //email template -> to the Customer 
                        // type: "ca", //panding status
                        type: "canceled", 
                        orderUrl: `${config.CLIENT_URL}/order/${data.order_id}`,
                        orderID: data.order_id,
                        invoiceID: data.invoice_id,
                        receiverEmail: data.customer_email, //to the Customer
                        farmerUsername: data.farmer_username,
                        customerUsername: data.customer_username,
                        totalAmount: data.total_amount,
                        orderItems: data.orderItems
                    }

                    const notificationMessage = ` Your requested order has canceled by: ${data.farmer_username} `
                    const logMessage = 'Send order cancel email to users to notification service';
                    const notification: OrderNotificationInterface = {
                        orderID: data.order_id,
                        senderID: data.farmer_id,  
                        senderUsername: data.farmer_username,
                        receiverID: data.customer_id,
                        receiverUsername: data.customer_username,
                        message: notificationMessage,
                        isRead: false
                    }
            
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
        log.info(`Users service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Users service customerDirectConsumer failed: ", error);
    }
}

export {
    placeOrderPaymentDirectConsumer,
    farmerAcceptOrderPaymentDirectConsumer
}