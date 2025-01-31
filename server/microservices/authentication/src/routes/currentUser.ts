import express, { Router } from 'express';
import { verifyGateway } from '@veckovn/growvia-shared';
import { getCurrentUser, resendVerificationEmail } from '@authentication/controllers/currentUser';

const router: Router = express.Router();

const currentUserRoutes = (): Router => {
    router.get('/current-user', verifyGateway, getCurrentUser);
    router.put('/resend-verification', verifyGateway, resendVerificationEmail);
    return router;
};

export { currentUserRoutes } //import it to routes.ts in src