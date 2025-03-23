import express, { Router } from 'express';
import { checkUserAuth } from "@gateway/authMiddleware";
import { get, mark} from '@gateway/controllers/notification';

const router: Router = express.Router();

// /api/gateway/v1/notification 
const notificationRoutes = (): Router => {
    router.get('/notification/:userID', checkUserAuth, get);
    router.put('/notification/mark', checkUserAuth, mark);
    return router;
};

export { notificationRoutes }