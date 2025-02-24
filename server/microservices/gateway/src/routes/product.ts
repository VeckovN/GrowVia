import express, { Router } from 'express';
import { create, update, deleteByID, getByID, getProductsByID, getByCategory} from '@gateway/controllers/product';
import { checkUserAuth } from "@gateway/authMiddleware";
// import { seedUser } from "@gateway/controllers/seed"; 

const router: Router = express.Router();

// /api/gateway/v1/product 
const productRoutes = (): Router => {
    router.post('/product/create', checkUserAuth, create);
    router.get('/product/:productID', checkUserAuth, getByID);
    router.get('/product/category/:category', checkUserAuth, getByCategory);
    router.get('/product/farmer/:productID', checkUserAuth, getProductsByID);
    router.put('/product/:productID', checkUserAuth, update);
    router.delete('/product/:productID/:farmerID', checkUserAuth, deleteByID);
    return router;
};

export { productRoutes }