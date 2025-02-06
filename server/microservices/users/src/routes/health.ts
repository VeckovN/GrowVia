import express, { Router} from "express";

const router:Router = express.Router();

export const healthRoutes = (): Router => {
    // router.get('/gateway-health', health); 
    return router;
};