import express, { Router } from 'express';
import { authUser, resendVerification } from "@gateway/controllers/currentUser";
import { checkUserAuth } from "@gateway/authMiddleware";

const router: Router = express.Router();
//This routes only authenticated/logged user can request (check does req.currentUser exist)

const currentUserRoutes = (): Router => {
    router.get('/auth/current-user', checkUserAuth, authUser);
    router.put('/auth/resend-verification', checkUserAuth, resendVerification);
    return router;
};

export { currentUserRoutes }