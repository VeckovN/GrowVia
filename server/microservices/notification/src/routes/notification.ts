import express, { Router} from "express";
import { 
    getNotifications,
    markNotification
} from '@notification/controllers/notification';

const router:Router = express.Router();

export const notificationRoutes = (): Router => {
    router.get('/:userID', getNotifications);
    router.put('/mark', markNotification);
    return router;
};