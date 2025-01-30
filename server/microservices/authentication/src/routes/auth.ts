import express, { Router } from 'express';
import { create, login, verifyEmail } from '@authentication/controllers/auth';
import { verifyGateway } from '@veckovn/growvia-shared';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', verifyGateway, create);
    router.post('/signin', verifyGateway, login);
    router.put('/verify-email', verifyGateway, verifyEmail);
    return router;
};

export { authRoutes } //import it to routes.ts in src