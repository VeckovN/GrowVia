import express, { Router} from "express";
import { health } from "@payment/controllers/health";

const router:Router = express.Router();

export const healthRoutes = (): Router => {
    router.get('/payment-health', health); 
    return router;
};