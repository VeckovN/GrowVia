import express, { Router} from "express";

const router:Router = express.Router();

export function customerRoutes():Router {
    router.get('');
    router.post('');
    router.delete('');
    return router;
}