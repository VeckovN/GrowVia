import express, { Router} from "express";
import { 
    productCreate, 
    productByID, 
    productsByCategory, 
    farmersProductsByID, 
    productUpdate, 
    productDelete, 
    searchProducts,
    getMoreProductsLikeThis
} from "@product/controllers/product";

const router:Router = express.Router();

export const productRoutes = (): Router => {
    router.post('/create', productCreate); 
    router.get('/:productID', productByID); 
    // /serach/:from/:size/:type?query=''?minPrice=''?maxPrice=''
    //query,maxPrice and minPrice is part of url (directly added)
    router.get('/serach/:from/:size/:type', searchProducts);  
    router.get('/search/similar/:productID', getMoreProductsLikeThis); 
    router.get('/category/:category', productsByCategory); 
    router.get('/farmer/:productID', farmersProductsByID); 
    // router.get('/farmer/:farmerID', getProductsByFarmerID); 
    router.put('/:productID', productUpdate); //data to body 
    router.delete('/:productID/:farmerID', productDelete); 
    return router;
};
