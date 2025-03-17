import express, { Router } from "express";
import { 
    placeCustomerOrder

} from "@order/controllers/order";

const router:Router = express.Router();

export const orderRoutes = (): Router => {
    router.post('/create', placeCustomerOrder);  
    return router; 
};
