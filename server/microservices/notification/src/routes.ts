import express, {Router, Request, Response} from 'express';

const router: Router = express.Router();

export function healthRoute(): Router {
    router.get("/notification-health", (_req: Request, res: Response) =>{
        res.status(200).send("Notification service is OK");
    });
    return router;
}


