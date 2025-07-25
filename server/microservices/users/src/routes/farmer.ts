import express, { Router} from "express";
import {
    getFarmerDetailsByID,
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    getNewestFarmers,
    updateFarmerData
} from "@users/controllers/farmer"

const router:Router = express.Router();

export function farmerRoutes():Router {
    router.get('/id/:ID', getFarmerDetailsByID);
    router.get('/username/:username', getFarmerDetailsByUsername);
    router.get('/email/:email', getFarmerDetailsByEmail);
    router.get('/newest/:limit', getNewestFarmers);
    router.patch('/id/:farmerID', updateFarmerData);
    return router;
}