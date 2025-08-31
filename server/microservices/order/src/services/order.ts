import { winstonLogger, BadRequestError, NotFoundError, OrderCreateInterface, OrderDocumentInterface, OrderEmailMessageInterface, OrderItemDocumentInterface, NotificationInterface } from '@veckovn/growvia-shared';
import { Logger } from "winston";
import { config } from "@order/config";
import { pool } from '@order/postgreSQL';
import { publishMessage } from '@order/rabbitmqQueues/producer';
import { orderChannel } from '@order/server';
import { orderSocketIO } from '@order/server';
import { postOrderNotificationWithEmail } from '@order/helper';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderService', 'debug');

const getOrderByID = async(orderID: string):Promise<OrderDocumentInterface | null> => {
    try{
        const resultOrder = await pool.query(`SELECT * FROM public.orders WHERE order_id = $1 `, [orderID]);
 
        if(resultOrder.rowCount === 0) return null;

        const resultOrderItems = await pool.query(`SELECT * FROM public.order_items WHERE order_id = $1 `, [orderID]);  
        const order: OrderDocumentInterface = {
            ...resultOrder.rows[0],
            orderItems: resultOrderItems.rows as OrderItemDocumentInterface[],
        }

        return order;
    }
    catch(error){
        log.log("error", "Order service: order can't be found");
        throw BadRequestError(`Failed to found Order by id: ${error} `, "orderService getOrderByID method error");
    }
}


const processOrderRows = async (orderRows: any): Promise<OrderDocumentInterface[]> => {

    const orders: OrderDocumentInterface[] = [];

    for(const orderRow of orderRows) {
        const resultOrderItems = await pool.query(
            `SELECT * FROM public.order_items WHERE order_id = $1 `, 
            [orderRow.order_id]
        );  

        orders.push({
            ...orderRow, //public.orders related data
            orderItems: resultOrderItems.rows as OrderItemDocumentInterface[]
        })
    }

    return orders;
}

//use the proccessOrderRows function avoid repeating the same logic as in getCustomerOrders
const getFarmerOrders = async(
    farmerID: string, 
    from:number, 
    size:number, 
    sort:string
):Promise<{orders: OrderDocumentInterface[] | null; total:number }> => {
    try {
        let whereClause = "WHERE farmer_id = $1";
        const params: any[] = [farmerID]; //value for a clause
        let orderBy = "created_at DESC"; //default

        if (sort === 'newest') orderBy = "created_at DESC";
        else if (sort === 'oldest') orderBy = "created_at ASC";
        else if (["pending", "accepted", "canceled", "rejected", "processing", "shipped", "completed"].includes(sort)) {
            whereClause += " AND order_status = $2";
            params.push(sort);
        }

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM public.orders ${whereClause}`,
        params
        );

        const total = Number(totalResult.rows[0].count);

        // for example there is only one params 'params[0] => $1 i want next ($2) params.lenght + 1 for 'size'
        const resultOrders = await pool.query(`
                SELECT * FROM public.orders 
                ${whereClause}
                ORDER BY ${orderBy}
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
            ,
            [...params, size, from]
        )
        
        if(resultOrders.rowCount === 0) return {orders:null, total:0};

        const orders = await processOrderRows(resultOrders.rows);

        return { orders, total}
    }
    catch (error){
        log.log("error", "Order service: farmer orders can't be found");
        throw BadRequestError(`Failed to found farmers order by farmerID: ${error} `, "orderService getOrderByID method error");
    }
}

const getCustomerOrders = async(
    customerID: string, 
    from:number, 
    size:number, 
    sort:string
):Promise<{orders: OrderDocumentInterface[] | null; total:number }> => {
    try {
        let whereClause = "WHERE customer_id = $1";
        const params: any[] = [customerID]; //value for clause
        let orderBy = "created_at DESC"; //default

        if (sort === 'newest') orderBy = "created_at DESC";
        else if (sort === 'oldest') orderBy = "created_at ASC";
        else if( sort === 'inProgress'){
            whereClause += " AND order_status IN ($2, $3, $4)"
            params.push("accepted", "processing", "shipped");
        }
        else if (["pending", "canceled", "rejected", "completed"].includes(sort)) {
            whereClause += " AND order_status = $2";
            params.push(sort);
        }

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM public.orders ${whereClause}`,
        params
        );

        const total = Number(totalResult.rows[0].count);

        // for example there is only one params 'params[0] => $1 i want next ($2) params.lenght + 1 for 'size'
        const resultOrders = await pool.query(`
                SELECT * FROM public.orders 
                ${whereClause}
                ORDER BY ${orderBy}
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
            ,
            [...params, size, from]
        )
        
        if(resultOrders.rowCount === 0) return {orders:null, total:0};

        const orders = await processOrderRows(resultOrders.rows);

        return { orders, total}
    }
    catch (error){
        log.log("error", "Order service: farmer orders can't be found");
        throw BadRequestError(`Failed to found farmers order by farmerID: ${error} `, "orderService getOrderByID method error");
    }
}

const placePendingOrder = async(orderData: OrderCreateInterface):Promise<OrderDocumentInterface> => {
    try {
        //Transaction: Together as one (Both succeed - order is fully placed, Or both fail - no partial data left in the database). )
        //1. Start Transaction
        await pool.query('BEGIN'); 

        //2. Insert Order
        const orderInsertQuery = `
        INSERT INTO public.orders (
            farmer_id,
            farmer_email,
            farmer_username,
            farm_name,
            customer_id,
            customer_email,
            customer_username,
            customer_first_name,
            customer_last_name,
            customer_phone,
            invoice_id,
            total_price, 
            order_status, 
            payment_type,
            payment_status, 
            payment_intent_id, 
            payment_method_id,
            payment_method,
            payment_expires_at,
            shipping_address,
            shipping_postal_code, 
            billing_address, 
            delivery_date, 
            tracking_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) 
        RETURNING order_id;
        `;

        const values = [
            orderData.farmer_id,
            orderData.farmer_email,
            orderData.farmer_username,
            orderData.farm_name,
            orderData.customer_id,
            orderData.customer_email,
            orderData.customer_username,
            orderData.customer_first_name || null,
            orderData.customer_last_name || null,
            orderData.customer_phone || null,
            orderData.invoice_id || null,
            orderData.total_price,
            orderData.order_status || "pending", 
            orderData.payment_type || 'cod',
            orderData.payment_status,
            orderData.payment_intent_id || null,
            orderData.payment_method_id || null,
            orderData.payment_method || null,
            orderData.payment_expires_at || null,
            orderData.shipping_address || null,
            orderData.shipping_postal_code || null,
            orderData.billing_address || null,
            orderData.delivery_date || null,
            orderData.tracking_url || null
        ];

        const orderResult = await pool.query(orderInsertQuery, values);
        const order_id = orderResult.rows[0].order_id; //used to make relations with orderItems


        //3. Insert The Order Items  
        const orderItemInsertQuery = `
            INSERT INTO order_items (
                order_id,
                product_id, 
                product_name,
                product_image_url,
                product_unit,
                quantity, 
                unit_price, 
                total_price
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `

        //loop through orderItems that passed as props of orderData
        for( const item of orderData.orderItems) {
            const orderItemValues = [
                order_id, //same order id for each orderItem
                item.product_id,
                item.product_name,
                item.product_image_url,
                item.product_unit,
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
            orderUrl: `${config.CLIENT_URL}/order/track/${order_id}`,
            orderID: order_id,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.farmer_email, //to the farmer (farmet got the notification)
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            customerEmail: orderData.customer_email,
            totalPrice: orderData.total_price,
            orderItems: orderData.orderItems
        }

        const notificationMessage = `You've got order request from user: ${orderData.customer_username}`;
        const order:OrderDocumentInterface = { ...orderData, order_id};

        const notification: NotificationInterface = {
            type: 'order', // must match enum in schema
            sender: {
                id: orderData.customer_id,
                name: `${orderData.customer_first_name} ${orderData.customer_last_name}`.trim(),
            },
            receiver: {
                id: orderData.farmer_id,
                name: orderData.farmer_username,
            },
            message: notificationMessage,
            isRead: false,
            bothUsers: false, // or true if needed
            order: {
                orderId: order_id,
                status: orderData.order_status || 'pending',
            },

            createdAt: new Date().toISOString(),
        };


        const logMessage = 'Send Order placed email Data to Notification service';
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

    if(!["stripe", "cod"].includes(orderData.payment_type)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    if(orderData.payment_type === "stripe"){
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
    else if(orderData.payment_type === "cod"){ //cash on delivery
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

    if(!["stripe", "cod"].includes(orderData.payment_type)){
        throw BadRequestError(`Failed to cancel Order, invalid payment method passed `, "orderService cancelOrder method error");
    }

    if(orderData.payment_type === "stripe"){
        //this sent data to PaymentService, and wait for response in consumer function (rabbitMQ)
        await publishMessage (
            orderChannel,
            // 'order-payment-customer',
            // 'order-payment-customer-key',
            'accept-reject-order-payment',
            'accept-reject-order-payment-key',
            'Order data sent to the Payment service to cancel capture payment and refund',
            JSON.stringify({type: "orderCanceled", data: orderData}),
        );
    }
    else if(orderData.payment_type === "cod"){ //cash on delivery
        await changeOrderStatus(orderID, "canceled");
        
        const emailMessage: OrderEmailMessageInterface = {
            template: "orderCanceled", //email template name 
            type: "canceled", //panding status
            orderUrl: `${config.CLIENT_URL}/order/track/${orderID}`,
            orderID: orderID,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.customer_email, //to the farmer (farmet got the notification)
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            totalPrice: orderData.total_price,
            orderItems: orderData.orderItems
        }

        const notificationMessage = `You're order has been canceled: #${orderData.order_id?.slice(0,8)}`;
        const order:OrderDocumentInterface = { ...orderData, order_id:orderID};

        const notification: NotificationInterface = {
            type: 'order', // must match enum in schema
            sender: {
                
                id: orderData.farmer_id,
                name: orderData.farmer_username,
            },
            receiver: {
                id: orderData.customer_id,
                name: `${orderData.customer_first_name} ${orderData.customer_last_name}`.trim(),
                
            },
            message: notificationMessage,
            isRead: false,
            bothUsers: false, // or true if needed
            order: {
                orderId: orderID,
                status: orderData.order_status || 'pending',
            },
            createdAt: new Date().toISOString(),
        };

        const logMessage = 'Send Cancel Order email Data to Notification service';
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
            logMessage,
            order,
            notification
        );
    }
}
 
const farmerApproveOrder = async(orderID: string): Promise<void> => {
    const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
    if(!orderData)
        throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed")

    if(!["stripe", "cod"].includes(orderData.payment_type)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    if(orderData.payment_type === 'stripe') {

        if(new Date() > orderData.payment_expires_at){
            if(orderData.payment_intent_id){
                await publishMessage (
                    orderChannel,
                    'accept-reject-order-payment',
                    'accept-reject-order-payment-key',
                    'Order data sent to the Payment service to cancel capture payment and refund',
                    JSON.stringify({type: "orderCanceled", data: orderData}),
                );

                log.log("error", "Order service: order can't be appoved due to authorization time expiration");
            }
            else
                throw BadRequestError(`Failed to approve order, payment_intent_id doesn't exists `, "orderService FarmerApproveOrder method error"); 

            throw BadRequestError(`Failed to approve order, payment authorization expired `, "orderService FarmerApproveOrder method error"); 
        }

        //sent to Payment Service
        await publishMessage(
            orderChannel,
            // 'accept-order-payment',
            // 'accept-order-payment-key',
            'accept-reject-order-payment',
            'accept-reject-order-payment-key',
            'Order approved data sent to the Payment service',
            // JSON.stringify({type: "orderApproved", data: orderData}),
            JSON.stringify({type: "orderApproved", data: orderData}),
        );

    }
    else if(orderData.payment_type === 'cod') //without payment integration just change order status
    {
        if(!orderData.order_id)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder with cod paymentMethod failed")
        
        await changeOrderStatus(orderData.order_id, 'accepted');
        
        const notificationMessage = `Your request order #${orderID.slice(0,8)}... has been approved`;

        //REFACTOR: use receiver/sender isntead of customer/farmer
        const emailMessage: OrderEmailMessageInterface = {
            template: "orderApproved", //email template name 
            type: "accepted", //panding status
            orderUrl: `${config.CLIENT_URL}/order/track/${orderID}`,
            orderID: orderID,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.customer_email, //to the farmer (farmet got the notification)
            farmerUsername: orderData.farmer_username,
            farmerEmail: orderData.farmer_email,
            customerUsername: orderData.customer_username,
            totalPrice: orderData.total_price,
            orderItems: orderData.orderItems
        }

        const notification: NotificationInterface = {
            type: 'order', // must match enum in schema
            sender: {
                id: orderData.farmer_id,
                name: orderData.farmer_username,
                // farmerAvatarUrl isn't part of Order data
                // avatarUrl: orderData?|| '', // fetch from user service / redux state
            },
            receiver: {
                id: orderData.customer_id,
                name: `${orderData.customer_first_name} ${orderData.customer_last_name}`.trim(),
            },
            message: notificationMessage,
            isRead: false,
            bothUsers: false, // or true if needed
            order: {
                orderId: orderID,
                status: orderData.order_status || 'pending',
            },
            createdAt: new Date().toISOString()
        };

        const logMessage = 'Send Farmer approved - "cod" email Data to Notification service';
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
            logMessage,
            orderData,
            notification
        );
    }
}

const farmerRejectOrder = async(orderData: OrderDocumentInterface): Promise<void> => {
    if(!["stripe", "cod"].includes(orderData.payment_type)){
        throw BadRequestError(`Failed to place Order, invalid payment method passed `, "orderService createOrder method error");
    }

    if(!orderData.order_id)
        throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder with cod paymentMethod failed")
    
    await changeOrderStatus(orderData.order_id, 'rejected');

    if(orderData.payment_type === 'stripe') {
        //to Payment service
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

const farmerStartOrderProccess = async(orderID: string): Promise<void> => { 
    try{  
        const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
        if(!orderData)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed")
        
        await changeOrderStatus(orderID, 'processing');

        const notificationMessage = `Your order #${orderID.slice(0,8)}... has begun processing`;

        const emailMessage: OrderEmailMessageInterface = {
            template: "orderPackaged", //email template name 
            type: "packaged", //panding status
            orderUrl: `${config.CLIENT_URL}/order/track/${orderID}`,
            orderID: orderID,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.customer_email, //to the farmer (farmet got the notification)
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            totalPrice: orderData.total_price,
            orderItems: orderData.orderItems
        }

        const notification: NotificationInterface = {
            type: 'order', // must match enum in schema
            sender: {
                id: orderData.farmer_id,
                name: orderData.farmer_username,
                // farmerAvatarUrl isn't part of Order data
                // avatarUrl: orderData?|| '', // fetch from user service / redux state
            },
            receiver: {
                id: orderData.customer_id,
                name: `${orderData.customer_first_name} ${orderData.customer_last_name}`.trim(),
            },
            message: notificationMessage,
            isRead: false,
            bothUsers: false, // or true if needed
            order: {
                orderId: orderID,
                status: orderData.order_status || 'pending',
            },
            createdAt: new Date().toISOString(),
        };
 
        //send email
        // await publishMessage(
        //     orderChannel,
        //     'order-email-notification',
        //     'order-email-key',
        //     'Send notfication email order is on the way to notification service',
        //     JSON.stringify(emailMessage)
        // )

         //socket event without sending email
        // await postOrderNotification( 
        //     orderChannel,
        //     orderSocketIO,
        //     logMessage,
        //     orderData,
        //     notification
        // );

        const logMessage = 'Send Order Start Process email Data to Notification service';
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
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

const farmerStartOrderDelivery = async(orderID: string):Promise<void> => {
    try{
        const orderData:OrderDocumentInterface | null = await getOrderByID(orderID);
        if(!orderData)
            throw NotFoundError("Failed to find the order, orderID doesn't exist", "orderService farmerApproveOrder failed");

        await changeOrderStatus(orderID, "shipped");

        const emailMessage: OrderEmailMessageInterface = {
            template: "orderOnTheWay", //email template name 
            type: "onTheWay", 
            orderUrl: `${config.CLIENT_URL}/order/track/${orderID}`,
            orderID: orderID,
            invoiceID: orderData.invoice_id,
            receiverEmail: orderData.customer_email,
            farmerUsername: orderData.farmer_username,
            customerUsername: orderData.customer_username,
            totalPrice: orderData.total_price,
            orderItems: orderData.orderItems
        }

        const notificationMessage = `Your orderID: #${ orderID.slice(0,8) }... is now out for delivery`;

        const notification: NotificationInterface = {
            type: 'order', // must match enum in schema
            sender: {
                id: orderData.farmer_id,
                name: orderData.farmer_username,
                // farmerAvatarUrl isn't part of Order data
                // avatarUrl: orderData?|| '', // fetch from user service / redux state
            },
            receiver: {
                id: orderData.customer_id,
                name: `${orderData.customer_first_name} ${orderData.customer_last_name}`.trim(),
            },
            message: notificationMessage,
            isRead: false,
            bothUsers: false, // or true if needed
            order: {
                orderId: orderID,
                status: orderData.order_status || 'pending',
            },
            createdAt: new Date().toISOString(),
        };

        const logMessage = `Send Order Is On The Way email Data to Notification service`;
        await postOrderNotificationWithEmail( 
            orderChannel,
            orderSocketIO,
            emailMessage,
            logMessage,
            orderData,
            notification
        );

        // await postOrderNotification( 
        //     orderChannel,
        //     orderSocketIO,
        //     logMessage,
        //     orderData,
        //     notification
        // );

        //Ack expected in consumer (after the productService decrease order products)
        //PUBLISH TO PRODUCT SERVICE (to decrease products amount that are delivering)       
        await publishMessage(
            orderChannel,
            'decrease-ordered-product',
            'decrease-ordered-product-key',
            'Send order data to decrease amount of ordered products to Product service',
            JSON.stringify({data: orderData.orderItems})
        )
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

        const validPaymentStatuses = ["pending", "authorized", "paid", "refunded", "canceled"];
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

        log.info(`Order ${orderID} status changed to ${newStatus}`);
    }
    catch(error){
        log.log("error", "Order service: order status can't be changed");
        throw BadRequestError(`Failed to change order status: ${error} `, "orderService changeStatus method error");
    }
}

export { 
    getOrderByID,
    getFarmerOrders,
    getCustomerOrders,
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