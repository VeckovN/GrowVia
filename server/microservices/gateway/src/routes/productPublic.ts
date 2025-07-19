import express, { Router } from 'express';
import { getByID, getFarmerProducts, similarProducts, newestProducts, products} from '@gateway/controllers/product';

const router: Router = express.Router();

// /api/gateway/v1/product 
const productPublicRoutes = (): Router => {
    //public routes (without 'checkUserAuth middleware')  
    router.get('/product/search', products);
    router.get('/product/:productID', getByID);
    router.get('/product/search/newest/:limit', newestProducts);
    router.get('/product/farmer/:farmerID', getFarmerProducts);
    router.get('/product/search/similar/:productID', similarProducts);
    return router;
};

export { productPublicRoutes }