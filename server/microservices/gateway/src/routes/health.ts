import express, { Router } from 'express';
import {health} from "@gateway/controllers/health";

const router: Router = express.Router();

const healthRoutes = (): Router => {
    router.get('/gateway-health', health);
    return router;
};

export { healthRoutes } //import it to routes.ts in src