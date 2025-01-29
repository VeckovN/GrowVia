import express, { Router } from 'express';
import { create } from '@authentication/controllers/auth';
import { verifyGateway } from '@veckovn/growvia-shared';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', verifyGateway, create);
    return router;
};

export { authRoutes } //import it to routes.ts in src