import express, { Router } from 'express';
import { create, login, verifyEmail, forgotPassword, resetPassword} from '@authentication/controllers/auth';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', create);
    router.post('/signin', login);
    router.put('/verify-email', verifyEmail);
    router.put('/forgot-password', forgotPassword);
    router.put('/reset-password/:token', resetPassword);
    return router;
};

export { authRoutes }