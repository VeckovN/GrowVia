import { winstonLogger, OrderEmailMessageInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@order/config';
import { publishMessage } from "@order/rabbitmqQueues/producer";
import { placePendingOrder, changeOrderStatus} from '@order/services/order';
import { orderChannel } from '@order/server';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderRabbitMQConsumer', 'debug');

// Persistent Queue with "TTL + Requeue"
//Durable and Persistent -> the message is stored in RabbitMQ even if the User Service is down.
//durable and persist is set on publish message -> ack must be sent after processing

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
        // const orderPaymentQueue = channel.assertQueue(queueName, {
        //     durable: true,
        //     arguments: {
        //         "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
        //         "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
        //         "x-dead-letter-routing-key": routingKey, // Send back to same queue
        //     }
        
        // });
        await channel.bindQueue((await orderPaymentQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await orderPaymentQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                // const {type, data} = JSON.parse(msg!.content.toString());
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
        //Consumer is Payment Service on 'order.accepted' 
        //The payment process has started, this listen on payment result of captured payment
        // const exchangeName = 'accept-order-payment';
        // const queueName = 'accept-order-payment-queue';
        // const routingKey = 'accept-order-payment-key'

        //The payment process has started, this listen on payment result 
        const exchangeName = 'payment-order-result';
        const queueName = 'payment-order-result-queue';
        const routingKey = 'payment-order-result-key'; 

        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
        const farmerAcceptQueue = channel.assertQueue(queueName, {durable: true});
        // const farmerAcceptQueue = channel.assertQueue(queueName, {
        //     durable: true,
        //     arguments: {
        //         "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
        //         "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
        //         "x-dead-letter-routing-key": routingKey, // Send back to same queue
        //     }
        
        // });
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
                    await publishMessage(
                        orderChannel,
                        'order-email-notification',
                        'order-email-key',
                        'Send order email data to notification service',
                        JSON.stringify(emailMessage)
                    )

                    log.info("Order Service: order approved - payment succeeded message recevied");
                    // log.info("User Service Data recieved from Authentication service");
                }

                //payment Fail on orderAccepted
                if (type == 'ApprovePaymentFailed'){
                    //Change order status to "Payment Failed" 
                    await changeOrderStatus(data.order_id, 'paymentFailed');
                    //Cancel the order
                    //change order to cancel 
                    //publish message to Notification Service (notify both users)
                    const emailMessage: OrderEmailMessageInterface = {
                        template: "orderPaymentFailed", //email template -> to the Customer 
                        type: "paymentFailed", //panding status
                        orderUrl: `${config.CLIENT_URL}/order/${data.order_id}`,
                        orderID: data.order_id,
                        invoiceID: data.invoice_id,
                        receiverEmail: data.customer_email, //and farmer as well
                        farmerUsername: data.farmer_username,
                        customerUsername: data.customer_username,
                        totalAmount: data.total_amount,
                        orderItems: data.orderItems
                    }
                    await publishMessage(
                        orderChannel,
                        'order-email-notification',
                        'order-email-key',
                        'Send order reject email to users to notification service',
                        JSON.stringify(emailMessage)
                    )

                    //Socket Emit (notification to both users)

                    // log.info("Order Service: order approved - payment succeeded message recevied");
                }

                //When Farmer reject customer requested order(that is paid with stripe)
                // if (type == 'paymentRejected'){
                if (type == 'paymentCanceled'){
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
                    await publishMessage(
                        orderChannel,
                        'order-email-notification',
                        'order-email-key',
                        'Send order reject email to notification service',
                        JSON.stringify(emailMessage)
                    )

                    await changeOrderStatus(data.order_id, "canceled", "canceled");
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

// const farmerDirectConsumer = async (channel:Channel):Promise<void> =>{
//     //consume from Authentication -> on signup(create farmer with additional info 
//     //consume from Order -> on create order, accept order, cancel order (when customer do)
// }
export {
    placeOrderPaymentDirectConsumer,
    farmerAcceptOrderPaymentDirectConsumer
}