import express, { Router } from 'express';
import { getByID, newestFarmers } from '@gateway/controllers/users/farmer';

const router: Router = express.Router();

const farmerPublicRoutes = (): Router => {
    //api/gatewy/v1/users/farmer/id/:ID
    router.get('/users/farmer/id/:ID', getByID); //put in private
    router.get('/users/farmer/newest/:limit', newestFarmers)
    return router;
};

export { farmerPublicRoutes}