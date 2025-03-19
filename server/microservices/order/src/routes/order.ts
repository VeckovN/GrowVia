import express, { Router } from "express";
import { 
    getOrder,
    placeCustomerOrder,
    cancelPlacedOrder,
    approveOrder,
    startOrderProccess,
    startOrderDelivery,
    finishOrder

} from "@order/controllers/order";

const router:Router = express.Router();

export const orderRoutes = (): Router => {
    router.get('/:orderID', getOrder);  
    router.post('/create', placeCustomerOrder);  
    router.put('/cancel/:orderID', cancelPlacedOrder);  
    router.put('/approve/:orderID', approveOrder);  
    router.put('/proccess/:orderID', startOrderProccess);  
    router.put('/delivery/:orderID', startOrderDelivery);  
    router.put('/finish/:orderID', finishOrder);  
    return router; 
};
