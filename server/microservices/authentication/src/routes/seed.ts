import express, { Router } from 'express';
import { seedUsers } from '@authentication/controllers/seeds';

const router: Router = express.Router();

const seedRoutes = (): Router => {
    router.put('/seed/:type/:count', seedUsers);
    return router;
};
    
export { seedRoutes } 