import express, { Router} from "express";

const router:Router = express.Router();

export function farmerRoutes():Router {
    router.get('');
    router.post('');
    router.delete('');
    return router;
}