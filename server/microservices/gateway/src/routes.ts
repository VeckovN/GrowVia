import { Application } from "express";
import { healthRoutes } from "@gateway/routes/health";
import { authRoutes } from "@gateway/routes/auth";

const BASE_PATH = '/api/gateway/v1';

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); // url is " " + "gateway-health"(return of healthRoutes()) => localhost:4000:/gateway-health
    // api/gateway/v1 + what authRoutes.routes() returns => /auth/something
    app.use(BASE_PATH, authRoutes()); //=> /api/gateway/v1/auth/something

    //with authenticationMiddleware (authentications checking)

    // app.use(BASE_PATH, verifyUser, productRoutes()); => 
}


// //HTTP only for Gateway (health route) "gateway-health"
// 'http://localhost:4000:/gateway-health'

// //For others 
// 'http://localhost:4000:/api/v1/auth/' //auth service for example (Signup route)
// 'http://localhost:4000:/api/v1/auth/signup' //(Signup route)

// 'http://localhost:4000:/api/v1/order/accept' //order service for example
