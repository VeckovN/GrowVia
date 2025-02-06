import { Application } from "express";
import { healthRoutes } from "@authentication/routes/health";
import { authRoutes } from "@authentication/routes/auth";
import { currentUserRoutes } from "@authentication/routes/currentUser";
import { seedRoutes } from "./routes/seed";
import { verifyGateway } from "@veckovn/growvia-shared";

const BASE_PATH ='/api/v1/auth' //ApiGateway -> AuthService
export function appRoutes(app:Application): void {
    //this request users makes when they're not logged in
    app.use('', healthRoutes()); 
    app.use(BASE_PATH, seedRoutes());

    //user have to be authenticated to request it
    app.use(BASE_PATH, verifyGateway, authRoutes());  // api/v1/auth/{exported Routes from authRoutes -> /signup, /signin}
    app.use(BASE_PATH, verifyGateway, currentUserRoutes());  // api/v1/auth/{exported Routes from authRoutes -> /signup, /signin}
}