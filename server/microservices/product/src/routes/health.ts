import express, { Router} from "express";
import { health } from "@product/controllers/health"

const router:Router = express.Router();

export const healthRoutes = (): Router => {
    router.get('/product-health', health); 
    return router;
};