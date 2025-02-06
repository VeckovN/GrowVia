import express, { Router } from 'express';
import {health} from "@authentication/controllers/health";

const router: Router = express.Router();

const healthRoutes = (): Router => {
    router.get('/auth-health', health);
    return router;
};

export { healthRoutes } //import it to routes.ts in src