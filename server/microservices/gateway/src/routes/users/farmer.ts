import express, { Router } from 'express';
import { getByUsername, getByEmail, updateByID} from '@gateway/controllers/users/farmer';
import { checkUserAuth } from "@gateway/authMiddleware";

const router: Router = express.Router();

// api/gateway/v1  /users/farmer
const farmerRoutes = (): Router => {
    //api/gatewy/v1/users/farmer/username/:username
    router.get('/users/farmer/username/:username', checkUserAuth, getByUsername);
    router.get('/users/farmer/email/:email', checkUserAuth, getByEmail);
    router.put('/users/farmer/id/:farmerID', checkUserAuth, updateByID);

    return router;
};

export { farmerRoutes }