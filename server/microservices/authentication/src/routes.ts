import { Application } from "express";
import { healthRoutes } from "@authentication/routes/health";
import { authRoutes } from "@authentication/routes/auth";

const BASE_PATH ='/api/v1/auth' //ApiGateway -> AuthService
export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    // app.use(BASE_PATH, verifyGateway, authRoutes); 
    app.use(BASE_PATH, authRoutes());  // api/v1/auth/{exported Routes from authRoutes -> /signup, /signin}
}