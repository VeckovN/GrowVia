import express, { Router } from 'express';
import { authUser, resendVerification, changeAuthUserPassword, refreshUserToken} from "@gateway/controllers/currentUser";
import { checkUserAuth } from "@gateway/authMiddleware";

const router: Router = express.Router();
//This routes only authenticated/logged user can request (check does req.currentUser exist)

const currentUserRoutes = (): Router => {
    router.get('/auth/current-user', checkUserAuth, authUser);
    router.put('/auth/resend-verification', checkUserAuth, resendVerification);
    router.put('/auth/change-password', changeAuthUserPassword);
    router.get('/auth/refresh-token', refreshUserToken);
    return router;
};

export { currentUserRoutes }