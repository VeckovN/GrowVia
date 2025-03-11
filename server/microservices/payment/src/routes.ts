import { Application } from "express";
import { healthRoutes } from "@payment/routes/health";
// import { verifyGateway } from "@veckovn/growvia-shared";

// const BASE_PATH ='/api/v1/payment' //ApiGateway -> PaymentService
export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    // app.use(`${BASE_PATH}/customer`, verifyGateway, customerRoutes()); 
}