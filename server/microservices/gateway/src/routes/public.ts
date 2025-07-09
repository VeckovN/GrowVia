import express, { Router } from 'express';
import { newestProducts, getByID} from '@gateway/controllers/product';
import { newestFarmers } from '@gateway/controllers/users/farmer';
const router: Router = express.Router();

// /api/gateway/v1/product 
const publicRoutes = (): Router => {
    router.get('/product/:productID',  getByID);
    router.get('/product/search/newest/:limit', newestProducts);
    router.get('/users/farmer/newest/:limit', newestFarmers)
    return router;
};

export { publicRoutes }