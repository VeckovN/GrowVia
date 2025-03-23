// import { OrderCreateZodSchema } from '@order/schema/order.schema';
import { winstonLogger, BadRequestError, NotFoundError, OrderCreateInterface, OrderDocumentInterface, OrderEmailMessageInterface, OrderItemDocumentInterface, OrderNotificationInterface } from '@veckovn/growvia-shared';
import { Logger } from "winston";
import { config } from "@order/config";
import { pool } from '@order/postgreSQL';
import { publishMessage } from '@order/rabbitmqQueues/producer';
import { orderChannel } from '@order/server';
import { orderSocketIO } from '@order/server';
import { postOrderNotification, postOrderNotificationWithEmail } from '@order/helper';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderService', 'debug');

// orderStatus { 'pending', 'accepted', 'rejected', 'paymentFailed', 'processing', 'on_the_way', 'delivered' }

const getOrderByID = async(orderID: string):Promise<OrderDocumentInterface | null> => {
    try{
        const resultOrder = await pool.query(`SELECT * FROM public.orders WHERE order_id = $1 `, [orderID]);
 
        if(resultOrder.rowCount === 0) return null;

        const resultOrderItems = await pool.query(`SELECT * FROM public.order_items WHERE order_id = $1 `, [orderID]);
        
        const order: OrderDocumentInterface = {
            ...resultOrder.rows[0],
            items: resultOrderItems.rows as OrderItemDocumentInterface[],
        }

        return order;
    }
    catch(error){
        log.log("error", "Order service: order can't be found");
        throw BadRequestError(`Failed to found Order by id: ${error} `, "orderService getOrderByID method error");
    }
}

//query for createing order
const placePendingOrder = async(orderData: OrderCreateInterface):Promise<OrderDocumentInterface> => {
    // await OrderCreateZodSchema.validate(orderData);
    console.log("PLACE PEDNIGN ORDER: ", orderData);
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
            farmer_username,
            farmer_email,
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
            payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
        RETURNING order_id;
        `;

        const values = [
            orderData.customer_id,
            orderData.farmer_id,
            orderData.customer_username,
            orderData.customer_email,
            orderData.farmer_username,
            orderData.farmer_email,
            orderData.invoice_id || null,
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

        const emailMessage: OrderEmailMessageInterface = {
            template: "orderPlaced", //email template name 
            type: "place", //panding status
            orderUrl: `${config.CLIENT_URL}/order/${order_id}`,
            orderID: order_id,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.farmer_email, //to the farmer (farmet got the notification)
            // receiverEmail: orderData.customer_email,
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            totalAmount: orderData.total_amount,
            orderItems: orderData.orderItems
        }

        const notificationMessage = ` You've got order request from user: ${orderData.customer_username} `
        const logMessage = 'Send order email data to notification service';
        const order:OrderDocumentInterface = { ...orderData, order_id};

        const notification: OrderNotificationInterface = {
            type: 'Order', 
            orderID: order_id,
            senderID: orderData.farmer_id,  
            senderUsername: orderData.farmer_username,
            receiverID: orderData.customer_id,
            receiverUsername: orderData.customer_username,
            message: notificationMessage,
            isRead: false
        }

        //send email and socket event
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
            logMessage,
            order,
            notification
        );

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
    console.log(" PlaceORder data: ", orderData);

    //handle notPropriete payment_method
    if(!["stripe", "cod"].includes(orderData.payment_method)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    if(orderData.payment_method === "stripe"){
        //this sent data to PaymentService, and wait for response in consumer function (rabbitMQ)
        await publishMessage (
            orderChannel,
            'order-payment-customer',
            'order-payment-customer-key',
            'Order data sent to the Payment service to place token and capture',
            JSON.stringify({type: "orderPlaced", data: orderData}),

        );
         // and waith feedback and place order -> as payment approved (with createOrderPaymentDirectConsumer Cosnumer)
    }
    else if(orderData.payment_method === "cod"){ //cash on delivery
        //place order with 'Pending Farmer Approval' ()
        // await insertOrder(orderData);
        await placePendingOrder(orderData);
    }

}

const cancelOrder = async(orderID: string):Promise<void> => {
    
    const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
    if(!orderData)
        throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed")
    
    //only 'panding' orders can be canceled
    if(orderData.order_status !== 'pending')
        throw BadRequestError(`Failed to cancel Order, only pending order can be canceled `, "orderService cancelOrder method error");

    console.log(" Cancel data: ", orderData);
    //handle notPropriete payment_method
    if(!["stripe", "cod"].includes(orderData.payment_method)){
        throw BadRequestError(`Failed to cancel Order, invalid payment method passed `, "orderService cancelOrder method error");
    }

    if(orderData.payment_method === "stripe"){
        //this sent data to PaymentService, and wait for response in consumer function (rabbitMQ)
        await publishMessage (
            orderChannel,
            // 'order-payment-customer',
            // 'order-payment-customer-key',
            'accept-reject-order-payment',
            'accept-reject-order-payment-key',
            'Order data sent to the Payment service to cancel capture payment and refund',
            JSON.stringify({type: "orderCanceled", data: orderData}),
            // JSON.stringify(messagePayload)
        );
    }
    else if(orderData.payment_method === "cod"){ //cash on delivery
        //place order with 'Pending Farmer Approval' ()
        // await insertOrder(orderData);
        await changeOrderStatus(orderID, "cancel");
    }

}


//on farmer approve order (status changed to 'accepted' and payment process starting -> produce/consume)
const farmerApproveOrder = async(orderID: string): Promise<void> => {
    const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
    if(!orderData)
        throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed")

    console.log("FarmerApproveOrder -- get Order By ID: ", orderData);

    if(!["stripe", "cod"].includes(orderData.payment_method)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    //verify orderData 

    //send orderApproved type message to payment service to start capturing
    if(orderData.payment_method === 'stripe') {
        await publishMessage(
            orderChannel,
            // 'accept-order-payment',
            // 'accept-order-payment-key',
            'accept-reject-order-payment',
            'accept-reject-order-payment-key',
            'Order approved data sent to the Payment service',
            JSON.stringify({type: "orderApproved", data: orderData}),
        );

    }
    else if(orderData.payment_method === 'cod') //without payment integration just change order status
    {
        if(!orderData.order_id)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder with cod paymentMethod failed")
        
        await changeOrderStatus(orderData.order_id, 'pending');
    }
}

const farmerRejectOrder = async(orderData: OrderDocumentInterface): Promise<void> => {
    if(!["stripe", "cod"].includes(orderData.payment_method)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    //verify orderData 

    if(!orderData.order_id)
        throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder with cod paymentMethod failed")
    
    await changeOrderStatus(orderData.order_id, 'rejected');

    //send orderData to paymentService to reject(refund) captured money.
    if(orderData.payment_method === 'stripe') {
        
        await publishMessage(
            orderChannel,
            // 'accept-order-payment',
            // 'accept-order-payment-key',
            'accept-reject-order-payment',
            'accept-reject-order-payment-key',
            'Order approved data sent to the Payment service',
            JSON.stringify({type: "orderRejected", data: orderData}),
        );

    }
}   


//Once payment is captured and  the order is acceptet farmer's is starting: packagin the product, arranging logistics.
const farmerStartOrderProccess = async(orderID: string): Promise<void> => { 
    try{  

        const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
        if(!orderData)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed")
        
        await changeOrderStatus(orderID, 'processing');

        const notificationMessage = ` Your order ${orderID} has begun processing `
        const logMessage = 'Send order email data to notification service';
        const notification: OrderNotificationInterface = {
            type: 'Order', 
            orderID: orderID,
            senderID: orderData.farmer_id,   
            senderUsername: orderData.farmer_username,
            receiverID: orderData.customer_id, 
            receiverUsername: orderData.customer_username,
            message: notificationMessage,
            isRead: false 
        }

        //publish notification (customer)
         //socket event without sending email
         await postOrderNotification( 
            orderChannel,
            orderSocketIO,
            logMessage,
            orderData,
            notification
        );

    }
    catch(error){
        log.log("error", "Order service: order progressing can't be started");
        throw BadRequestError(`Failed to start order processing: ${error} `, "orderService farmerStartOrderDeliveryProcess method error");
    }
}

//This status means the order has left the warehouse and is on its way to the custome
//Sending tracking information, //Updating inventory, Notifying the customer.
const farmerStartOrderDelivery = async(orderID: string):Promise<void> => {
    try{
        const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
        if(!orderData)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed");

        await changeOrderStatus(orderID, "shipped");

        const emailMessage: OrderEmailMessageInterface = {
            template: "orderOnTheWay", //email template name 
            type: "onTheWay", 
            // orderUrl: `${config.CLIENT_URL}/order/${orderData.order_id}`,
            orderUrl: `${config.CLIENT_URL}/order/${orderID}`,
            orderID: orderID,
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
            'Send notfication email order is on the way to notification service',
            JSON.stringify(emailMessage)
        )

        const notificationMessage = ` Your orderID: ${ orderID } is now out for delivery `
        const logMessage = `Send notfication email order is on the way to notification service`;
        const notification: OrderNotificationInterface = {
            type: 'Order', 
            orderID: orderID,
            senderID: orderData.farmer_id,  
            senderUsername: orderData.farmer_username,
            receiverID: orderData.customer_id,
            receiverUsername: orderData.customer_username,
            message: notificationMessage,
            isRead: false,
        }

        //send email and socket event
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
            logMessage,
            orderData,
            notification
        );


        //PUBLISH TO PRODUCT SERVICE (to decrease products amount that are delivering)       
        // await publishMessage(
        //     orderChannel,
        //     'decrease-ordered-product',
        //     'decrease-ordered-product-key',
        //     'Send order data to decrease amount of ordered products to Product service',
        //     JSON.stringify({order: orderData})
        // )
    }
    catch(error){
        log.log("error", "Order service: order delivery can't be started");
        throw BadRequestError(`Failed to start order delivery: ${error} `, "orderService farmerStartOrderDeliveryProcess method error");
    }
}

const farmerFinishOrderDelivery = async(orderID: string):Promise<void> => {
    try{
        const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
        if(!orderData)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed");
        
        await changeOrderStatus(orderID, "completed");

    }
    catch(error){
        log.log("error", "Order service: order can't be finished/delivered");
        throw BadRequestError(`Failed to finish order delivery: ${error} `, "orderService farmerStartOrderDeliveryProcess method error");
    }

}

const changeOrderStatus = async(orderID: string, newStatus: string, newPaymentStatus?: string): Promise<void> => {
    try{
        const validStatuses = ["pending", "accepted", "canceled", "processing", "shipped", "completed"];
        if (!validStatuses.includes(newStatus)) {
            throw BadRequestError("Invalid order status provided", "orderService changeStatus method error");
        }

        const validPaymentStatuses = ["pending", "accepted", "canceled", "refunded"];
        if(newPaymentStatus && !validPaymentStatuses.includes(newPaymentStatus)){
            throw BadRequestError("Invalid payment order status provided", "orderService changeStatus method error");
        }

        let changeOrderQuery;
        let changeOrderValues;
        if(newStatus && newPaymentStatus){
            changeOrderQuery = `
                UPDATE public.orders
                SET order_status = $2, payment_status = $3
                WHERE order_id = $1
            `
            changeOrderValues = [ orderID, newStatus, newPaymentStatus];
        }
        else{
            changeOrderQuery = `
                UPDATE public.orders
                SET order_status = $2
                WHERE order_id = $1
            `
            changeOrderValues = [ orderID, newStatus];
        }

        const result = await pool.query(changeOrderQuery, changeOrderValues);

        if(result.rowCount === 0){
            throw NotFoundError(`Order with ID ${orderID} not found `, "orderService changeStatus method error");
        }

        console.log(`Order ${orderID} status changed to ${newStatus}`);
        log.info(`Order ${orderID} status changed to ${newStatus}`);
    }
    catch(error){
        console.log("error", "Order service: order status can't be changed");
        log.log("error", "Order service: order status can't be changed");
        throw BadRequestError(`Failed to change order status: ${error} `, "orderService changeStatus method error");
    }
}


export { 
    getOrderByID,
    placePendingOrder,
    placeOrder,
    cancelOrder,
    farmerApproveOrder,
    changeOrderStatus,
    farmerRejectOrder,
    farmerStartOrderProccess,
    farmerStartOrderDelivery,
    farmerFinishOrderDelivery
}