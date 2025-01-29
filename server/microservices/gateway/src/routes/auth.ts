import express, { Router } from 'express';
import { register } from "@gateway/controllers/auth/signup";

const router: Router = express.Router();

// api/gateway/v1/auth/ 
const authRoutes = (): Router => {
    router.post('/auth/signup', register);
    return router;
};

export { authRoutes }