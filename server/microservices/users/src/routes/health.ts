import express, { Router} from "express";
import { health } from "@users/controllers/health";

const router:Router = express.Router();

export const healthRoutes = (): Router => {
    router.get('/users-health', health); 
    return router;
};