import express, { Router} from "express";
import { health } from "@notification/controllers/health";

const router:Router = express.Router();

export const healthRoutes = (): Router => {
    router.get('/notification-health', health); 
    return router;
};
