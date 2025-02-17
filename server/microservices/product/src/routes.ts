import { Application } from "express";
import { healthRoutes } from "@product/routes/health";
// import { verifyGateway } from "@veckovn/growvia-shared";

// const BASE_PATH ='/api/v1/product' //ApiGateway -> AuthService
export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    // app.use(`${BASE_PATH}`, verifyGateway, productRoutes()); 
    // app.use(`${BASE_PATH}`, verifyGateway, searchRoutes()); 
}