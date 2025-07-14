import express, { Router } from 'express';
import { create, update, deleteByID, getByCategory, products } from '@gateway/controllers/product';
import { checkUserAuth } from "@gateway/authMiddleware";

const router: Router = express.Router();

// /api/gateway/v1/product 
const productRoutes = (): Router => {
    router.post('/product/create', checkUserAuth, create);
    router.get('/product/category/:category', checkUserAuth, getByCategory);
    router.get('/product/search/:from/:size/:type', checkUserAuth, products);
    router.put('/product/:productID', checkUserAuth, update);
    router.delete('/product/:productID/:farmerID', checkUserAuth, deleteByID);
    return router;
};

export { productRoutes }