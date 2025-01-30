import express, { Router } from 'express';
import { register, login, userEmailVerification} from "@gateway/controllers/auth/signup";

const router: Router = express.Router();

// api/gateway/v1/auth/ 
const authRoutes = (): Router => {
    router.post('/auth/signup', register);
    router.post('/auth/signin', login);
    router.put('/auth/verify-email', userEmailVerification);
    return router;
};

export { authRoutes }