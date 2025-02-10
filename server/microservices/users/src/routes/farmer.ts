import express, { Router} from "express";
import {
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    updateFarmerData
} from "@users/controllers/farmer"

const router:Router = express.Router();

export function farmerRoutes():Router {
    router.get('/username/:username', getFarmerDetailsByUsername);
    router.get('/email/:email', getFarmerDetailsByEmail);
    router.put('/id/:farmerID', updateFarmerData);
    return router;
}