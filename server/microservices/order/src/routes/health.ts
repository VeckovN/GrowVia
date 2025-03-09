import express, { Router } from 'express';
import { health } from "@order/controllers/health";

const router: Router = express.Router();

const healthRoutes = (): Router => {
    router.get('/order-health', health);
    return router;
};

export { healthRoutes } //import it to routes.ts in src