import express, { Router } from 'express';
// import { register, login, userEmailVerification, userForgotPassword, resetUserPassword} from "@gateway/controllers/auth";
// import { seedUser } from "@gateway/controllers/seed"; 
import { getByUsername, getByEmail, updateByID, addToWishlist, removeFromWishlist, addToSavedList, removeFromSavedList, updateOrderHistory} from '@gateway/controllers/users/customer';
import { checkUserAuth } from "@gateway/authMiddleware";


const router: Router = express.Router();

// api/gateway/v1  /users/customer 
const customerRoutes = (): Router => {
    //api/gatewy/v1/users/customer/username/:username
    router.get('/users/customer/username/:username', checkUserAuth, getByUsername);
    router.get('/users/customer/email/:email', checkUserAuth, getByEmail);
    router.patch('/users/customer/id/:customerID', checkUserAuth, updateByID);
    router.post('/users/customer/wishlist', checkUserAuth, addToWishlist);
    router.delete('/users/customer/:customerID/wishlist/:productID', removeFromWishlist); //customer/1231/wishlist/321
    router.post('/users/customer/savedlist', addToSavedList);
    router.delete('/users/customer/:customerID/savedlist/:farmerID', removeFromSavedList);
    router.post('/users/customer/add/order-history', updateOrderHistory);

    return router;
};

export { customerRoutes }