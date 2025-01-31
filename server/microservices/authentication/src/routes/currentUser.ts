import express, { Router } from 'express';
import { verifyGateway } from '@veckovn/growvia-shared';
import { getCurrentUser, resendVerificationEmail, changePassword} from '@authentication/controllers/currentUser';

const router: Router = express.Router();

const currentUserRoutes = (): Router => {
    router.get('/current-user', verifyGateway, getCurrentUser);
    router.put('/resend-verification', verifyGateway, resendVerificationEmail);
    router.put('/change-password', verifyGateway, changePassword);
    return router;
};

export { currentUserRoutes } //import it to routes.ts in src