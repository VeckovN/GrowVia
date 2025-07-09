import express, { Router} from "express";
import { 
    productCreate, 
    productByID, 
    productsByCategory, 
    farmerProductsByID, 
    productUpdate, 
    productDelete, 
    searchProducts,
    getMoreProductsLikeThis,
    getNewestProductsInOrder
} from "@product/controllers/product";

const router:Router = express.Router();

export const productRoutes = (): Router => {
    router.post('/create', productCreate); 
    router.get('/:productID', productByID); 
    router.get('/search/:from/:size/:type', searchProducts);  
    router.get('/search/similar/:productID', getMoreProductsLikeThis); 
    router.get('/search/newest/:limit', getNewestProductsInOrder); 
    router.get('/category/:category', productsByCategory); 
    router.get('/farmer/:farmerID', farmerProductsByID); 
    router.put('/:productID', productUpdate); //data to body 
    router.delete('/:productID/:farmerID', productDelete); 
    return router;
};
