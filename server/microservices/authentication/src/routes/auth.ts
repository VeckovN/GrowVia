import express, { Router } from 'express';
import { create, login, verifyEmail, forgotPassword, resetPassword, changePassword} from '@authentication/controllers/auth';
import { verifyGateway } from '@veckovn/growvia-shared';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', verifyGateway, create);
    router.post('/signin', verifyGateway, login);
    router.put('/verify-email', verifyGateway, verifyEmail);
    router.put('/forgot-password', verifyGateway, forgotPassword);
    router.put('/reset-password', verifyGateway, resetPassword);
    router.put('/change-password', verifyGateway, changePassword);
    return router;
};

export { authRoutes } //import it to routes.ts in src