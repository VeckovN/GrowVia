import { Application } from "express";
import { verifyGateway } from "@veckovn/growvia-shared";
import { healthRoutes } from "@product/routes/health";
import { productRoutes } from "@product/routes/product";

const BASE_PATH ='/api/v1/product'; //ApiGateway -> AuthService

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    app.use(`${BASE_PATH}`, verifyGateway, productRoutes()); 
    // app.use(`${BASE_PATH}`, verifyGateway, searchRoutes()); 
}