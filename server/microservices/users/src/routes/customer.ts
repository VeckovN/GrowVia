import express, { Router} from "express";
import { 
    getCustomerDetailsByUsername, 
    getCustomerDetailsByEmail, 
    updateCustomerData,
    addProductToWishlist,
    removeProductToWishlist,
    addFarmerToSavedList,
    removeFarmerToSavedList,
    addOrderToHistory
}  from "@users/controllers/customer";

const router:Router = express.Router();

export function customerRoutes():Router {
    router.get('/username/:username', getCustomerDetailsByUsername);
    router.get('/email/:email', getCustomerDetailsByEmail);
    // router.put('/id/:customerID', updateCustomerData);
    router.patch('/id/:customerID', updateCustomerData);
    router.post('/wishlist', addProductToWishlist);
    // router.delete('/wishlist', removeProductToWishlist);
    router.delete('/:customerID/wishlist/:productID', removeProductToWishlist); //customer/1231/wishlist/321
    router.post('/savedlist', addFarmerToSavedList);
    router.delete('/:customerID/savedlist/:farmerID', removeFarmerToSavedList);
    // router.delete('');
    router.post('/add/order-history', addOrderToHistory);

    return router;
}