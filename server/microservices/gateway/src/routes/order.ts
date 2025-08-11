import express, { Router } from 'express';
import { get, getFarmerOrders, getCustomerOrders, create, cancel, approve, startProccess, startDelivery, finishDelivery } from '@gateway/controllers/order';
import { checkUserAuth } from "@gateway/authMiddleware";
// import { seedUser } from "@gateway/controllers/seed"; 

const router: Router = express.Router();

// /api/gateway/v1/order 
const orderRoutes = (): Router => {
    router.get('/order/:orderID', checkUserAuth, get);
    router.get('/order/farmer/:farmerID', checkUserAuth, getFarmerOrders);
    router.get('/order/customer/:customerID', checkUserAuth, getCustomerOrders);
    router.post('/order/create', checkUserAuth, create);
    router.put('/order/cancel/:orderID', checkUserAuth, cancel);
    router.put('/order/approve/:orderID', checkUserAuth, approve);
    router.put('/order/proccess/:orderID', checkUserAuth, startProccess);
    router.put('/order/delivery/:orderID', checkUserAuth, startDelivery);
    router.put('/order/finish/:orderID', checkUserAuth, finishDelivery);
    // router.put('/product/:productID', checkUserAuth, update);
    // router.delete('/product/:productID/:farmerID', checkUserAuth, deleteByID);
    return router;
};

export { orderRoutes }