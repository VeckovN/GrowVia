import express, { Router } from 'express';
import { getCurrentUser, resendVerificationEmail, changePassword, refreshToken} from '@authentication/controllers/currentUser';

const router: Router = express.Router();

const currentUserRoutes = (): Router => {
    router.get('/current-user', getCurrentUser);
    router.put('/resend-verification', resendVerificationEmail);
    router.put('/change-password', changePassword);
    router.get('/refresh-token', refreshToken);
    return router;
};

export { currentUserRoutes }