import express, { Router } from 'express';
import { create } from '@authentication/controllers/auth';

const router: Router = express.Router();

const authRoutes = (): Router => {
    router.post('/signup', create);
    return router;
};

export { authRoutes } //import it to routes.ts in src