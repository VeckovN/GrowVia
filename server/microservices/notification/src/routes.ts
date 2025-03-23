import { Application } from "express";
import { verifyGateway } from "@veckovn/growvia-shared";
import { healthRoutes } from "@notification/routes/health";
import { notificationRoutes } from "@notification/routes/notification";

const BASE_PATH ='/api/v1/notification'; 

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    app.use(`${BASE_PATH}`, verifyGateway, notificationRoutes()); 
    // app.use(`${BASE_PATH}`, verifyGateway, searchRoutes()); 
}

