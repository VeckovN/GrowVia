import express, { Router } from 'express';
import { create } from '@gateway/controllers/order';
import { checkUserAuth } from "@gateway/authMiddleware";
// import { seedUser } from "@gateway/controllers/seed"; 

const router: Router = express.Router();

// /api/gateway/v1/order 
const orderRoutes = (): Router => {
    router.post('/order/create', checkUserAuth, create);
    // router.get('/product/:productID', checkUserAuth, getByID);
    // router.get('/product/category/:category', checkUserAuth, getByCategory);
    // router.get('/product/farmer/:farmerID', checkUserAuth, getFarmerProducts);
    // router.get('/product/search/:from/:size/:type', checkUserAuth, products);
    // router.get('/product/search/similar/:productID', checkUserAuth, similarProducts);
    // router.put('/product/:productID', checkUserAuth, update);
    // router.delete('/product/:productID/:farmerID', checkUserAuth, deleteByID);
    return router;
};

export { orderRoutes }