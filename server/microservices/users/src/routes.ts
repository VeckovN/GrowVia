import { Application } from "express";
import { healthRoutes } from "@users/routes/health";
import { customerRoutes } from "@users/routes/customer";
import { farmerRoutes } from "@users/routes/farmer";
import { verifyGateway } from "@veckovn/growvia-shared";

const BASE_PATH ='/api/v1/users' //ApiGateway -> AuthService
export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    app.use(`${BASE_PATH}/customer`, verifyGateway, customerRoutes());  // api/v1/auth/{exported Routes from authRoutes -> /signup, /signin}
    app.use(`${BASE_PATH}/farmer`, verifyGateway, farmerRoutes());
}