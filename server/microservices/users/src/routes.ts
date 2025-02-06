import { Application } from "express";
import { healthRoutes } from "@users/routes/health";
import { customerRoutes } from "@users/routes/customer";
import { farmerRoutes } from "@users/routes/farmer";

const BASE_PATH ='/api/v1/users' //ApiGateway -> AuthService
export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    app.use(`${BASE_PATH}/customer`, customerRoutes());  // api/v1/auth/{exported Routes from authRoutes -> /signup, /signin}
    app.use(`${BASE_PATH}/farmer`, farmerRoutes());
}