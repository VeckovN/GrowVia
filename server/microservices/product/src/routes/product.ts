import express, { Router} from "express";
import { productCreate, productByID, productUpdate, productDelete } from "@product/controllers/product";

const router:Router = express.Router();

export const productRoutes = (): Router => {
    router.post('/create', productCreate); 
    router.get('/:productID', productByID); 
    // router.get('/farmer/:farmerID', getProductsByFarmerID); 
    router.put('/:productID', productUpdate); //data to body 
    router.delete('/:productID/:farmerID', productDelete); 
    return router;
};
