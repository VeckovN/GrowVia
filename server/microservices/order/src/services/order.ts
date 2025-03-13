// import { OrderCreateZodSchema } from '@order/schema/order.schema';
import { winstonLogger, BadRequestError, NotFoundError, OrderCreateInterface, OrderDocumentInterface, OrderEmailMessageInterface } from '@veckovn/growvia-shared';
import { Logger } from "winston";
import { config } from "@order/config";
import { pool } from '@order/postgreSQL';
import { publishMessage } from '@order/rabbitmqQueues/producer';
import { orderChannel } from '@order/server';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderService', 'debug');


//query for createing order
const placePendingOrder = async(orderData: OrderCreateInterface):Promise<OrderDocumentInterface> => {
    // await OrderCreateZodSchema.validate(orderData);
    
    try {
        //Transaction: Together as one (Both succeed - order is fully placed, Or both fail - no partial data left in the database). )
        //1. Start Transaction
        await pool.query('BEGIN'); 

        //2. Insert Order
        const orderInsertQuery = `
        INSERT INTO public.orders (
            customer_id,
            farmer_id,
            customer_username,
            customer_email,
            farmer_username
            invoice_id,
            total_amount, 
            payment_status, 
            order_status, 
            payment_intent_id, 
            payment_token, 
            shipping_address, 
            billing_address, 
            delivery_date, 
            tracking_url, 
            payment_method,
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING order_id;
        `;

        const values = [
            orderData.customer_id,
            orderData.farmer_id,
            orderData.customer_username,
            orderData.customer_email,
            orderData.farmer_username,
            orderData.invoice_id,
            orderData.total_amount,
            orderData.payment_status,
            orderData.order_status || "pending", 
            orderData.payment_intent_id || null,
            orderData.payment_token || null,
            orderData.shipping_address || null,
            orderData.billing_address || null,
            orderData.delivery_date || null,
            orderData.tracking_url || null,
            orderData.payment_method || 'cod' 
        ];

        const orderResult = await pool.query(orderInsertQuery, values);
        const order_id = orderResult.rows[0].order_id; //used to make relations with orderItems


        //3. Insert The Order Items  
        const orderItemInsertQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
            VALUES ($1, $2, $3, $4, $5);
        `

        //loop through orderItems that passed as props of orderData
        for( const item of orderData.orderItems) {
            const orderItemValues = [
                order_id, //same order id for each orderItem
                item.product_id,
                item.quantity,
                item.unit_price,
                item.total_price
            ];
            //insert orderIem
            await pool.query(orderItemInsertQuery, orderItemValues);
        }

        //4. Commit transaction if everythinkg is successful
        await pool.query('COMMIT');
        log.info("Order and items successfully created."); 

        //send Notification to NotificationService 
        //and send SocketIO event that notify user to add notification alert and put notification in the list
        //Maybe to put it in the same function
        
        const emailMessage: OrderEmailMessageInterface = {
            template: "orderPlaced", //email template name 
            type: "place", //panding status
            orderUrl: `${config.CLIENT_URL}/order/${order_id}`,
            orderID: order_id,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.customer_email,
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            totalAmount: orderData.total_amount,
            orderItems: orderData.orderItems
        }
        await publishMessage(
            orderChannel,
            'order-email-notification',
            'order-email-key',
            'Send order email data to notification service',
            JSON.stringify(emailMessage)
        )

        //SOCKET EMIT

        const resultOrder:OrderDocumentInterface = { ...orderData, order_id };
        return resultOrder; 
    }
    catch(error){   
        //5. Rollback transaction on error
        await pool.query('ROLLBACK');
        log.log("error", "Order service: order can't be placed");
        throw BadRequestError(`Failed to place Order and items: ${error} `, "orderService inserOrder method error");
    }
    // finally{
    //     pool.release(); // 6. Release the client back to the pool
    // }
}


//place order (until the farmer approve it) -- panding state  
const placeOrder = async(orderData: OrderCreateInterface):Promise<void> => {
    
    //handle notPropriete payment_method
    if(!["stripe", "cod"].includes(orderData.payment_method)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    if(orderData.payment_method === "stripe"){
         //send to payment service (data that's need for payment intent) 
         // - Publish with 'type = orderPlaced')

        //this sent data to PaymentService, and wait for response in consumer function (rabbitMQ)
        await publishMessage (
            orderChannel,
            'order-payment-customer',
            'order-payment-customer-key',
            'Order data sent to the Payment service to place token and capture',
            JSON.stringify({type: "orderPlaced", data: orderData}),
            // JSON.stringify(messagePayload)
        );
         // and waith feedback and place order -> as payment approved (with createOrderPaymentDirectConsumer Cosnumer)
    }
    else if(orderData.payment_method === "cod"){ //cash on delivery
        //place order with 'Pending Farmer Approval' ()
        // await insertOrder(orderData);
        await placePendingOrder(orderData);
    }

}

//on farmer approve order (status changed to 'accepted' and payment process starting -> produce/consume)
const farmerApproveOrder = async(): Promise<void> => {
    // const exchangeName = 'accept-order-payment-customer';
    // const queueName = 'accept-order-payment-customer-queue';
    // const routingKey = 'accept-order-payment-customer-key';



}

// const farmerCancelOrder = async(): Promise<void> => {
//     //
// }

const changeOrderStatus = async(orderID: string, newStatus: string): Promise<void> => {
    try{
        const validStatuses = ["pending", "accepted", "canceled", "shipped", "completed"];
        if (!validStatuses.includes(newStatus)) {
            throw BadRequestError("Invalid order status provided", "orderService changeStatus method error");
        }

        const changeOrderQuery = `
            UPDATE public.orders
            SET order_status = $2
            WHERE order_id = $1
        `
        const changeOrderValues = [ orderID, newStatus];

        const result = await pool.query(changeOrderQuery, changeOrderValues);

        if(result.rowCount === 0){
            throw NotFoundError(`Order with ID ${orderID} not found `, "orderService changeStatus method error");
        }

        log.info(`Order ${orderID} status changed to ${newStatus}`);
    }
    catch(error){
        log.log("error", "Order service: order status can't be changed");
        throw BadRequestError(`Failed to change order status: ${error} `, "orderService changeStatus method error");
    }
}


export { 
    placePendingOrder,
    placeOrder,
    farmerApproveOrder,
    changeOrderStatus
    // farmerCancelOrder,
    // changeOrderStatus
}