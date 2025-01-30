import express, { Router } from 'express';
import { register, login, userEmailVerification, userChangePassword, userForgotPassword, resetUserPassword} from "@gateway/controllers/auth/signup";

const router: Router = express.Router();

// api/gateway/v1/auth/ 
const authRoutes = (): Router => {
    router.post('/auth/signup', register);
    router.post('/auth/signin', login);
    router.put('/auth/verify-email', userEmailVerification);
    router.put('/auth/change-password', userChangePassword);
    router.put('/auth/forgot-password',  userForgotPassword);
    router.put('/auth/reset-password/:token', resetUserPassword);

    return router;
};

export { authRoutes }