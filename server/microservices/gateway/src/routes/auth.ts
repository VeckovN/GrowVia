import express, { Router } from 'express';
import { register, login, logout, userEmailVerification, userForgotPassword, resetUserPassword} from "@gateway/controllers/auth";
import { seedUser } from "@gateway/controllers/seed"; 

const router: Router = express.Router();

// api/gateway/v1/auth/ 
const authRoutes = (): Router => {
    router.post('/auth/signup', register);
    router.post('/auth/signin', login);
    router.post('/auth/signout', logout)
    router.put('/auth/verify-email', userEmailVerification);
    router.put('/auth/forgot-password',  userForgotPassword);
    router.put('/auth/reset-password/:token', resetUserPassword);
    router.put('/auth/seed/:type/:count', seedUser); 
    return router;
};

export { authRoutes }
