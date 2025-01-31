import express, { Router } from 'express';
import { create, login, verifyEmail, forgotPassword, resetPassword} from '@authentication/controllers/auth';
import { verifyGateway } from '@veckovn/growvia-shared';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', verifyGateway, create);
    router.post('/signin', verifyGateway, login);
    router.put('/verify-email', verifyGateway, verifyEmail);
    router.put('/forgot-password', verifyGateway, forgotPassword);
    router.put('/reset-password/:token', verifyGateway, resetPassword);
    return router;
};

export { authRoutes } //import it to routes.ts in src