import { Application } from "express";
import { healthRoutes } from "@gateway/routes/health";
import { authRoutes } from "@gateway/routes/auth";
import { notificationRoutes } from "@gateway/routes/notification";
import { currentUserRoutes } from "@gateway/routes/currentUser";
import { customerRoutes } from "@gateway/routes/users/customer";
import { farmerRoutes } from "./routes/users/farmer";
import { farmerPublicRoutes } from "@gateway/routes/users/farmerPublic";
import { productRoutes } from "@gateway/routes/product";
import { productPublicRoutes } from "@gateway/routes/productPublic";
import { orderRoutes } from "@gateway/routes/order";
import { verifyUser } from "./authMiddleware";

const BASE_PATH = '/api/gateway/v1';

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); // url is " " + "gateway-health"(return of healthRoutes()) => localhost:4000:/gateway-health 
   
    // api/gateway/v1 + what authRoutes.routes() returns => /auth/something
    app.use(BASE_PATH, authRoutes());  //api/gateway/v1/auth/something

    // Register public routes BEFORE any protected routes.
    // If placed after `verifyUser`, they will still trigger the middleware unintentionally.
    app.use(BASE_PATH, farmerPublicRoutes());
    app.use(BASE_PATH, productPublicRoutes());

    //with authenticationMiddleware (authentications checking) Protected routes
    app.use(BASE_PATH, verifyUser, currentUserRoutes());
    app.use(BASE_PATH, verifyUser, notificationRoutes());
    app.use(BASE_PATH, verifyUser, customerRoutes());
    app.use(BASE_PATH, verifyUser, farmerRoutes());
    app.use(BASE_PATH, verifyUser, productRoutes());  
    app.use(BASE_PATH, verifyUser, orderRoutes());
}


// //HTTP only for Gateway (health route) "gateway-health"
// 'http://localhost:4000:/gateway-health'

// //For others 
// 'http://localhost:4000:/api/v1/auth/' //auth service for example (Signup route)
// 'http://localhost:4000:/api/v1/auth/signup' //(Signup route)
// 'http://localhost:4000:/api/v1/order/accept' //order service for example