import { Application } from "express";
import { verifyGateway } from "@veckovn/growvia-shared";
import { healthRoutes } from "@order/routes/health";
// import { productRoutes } from "@product/routes/product";
import { orderRoutes } from "@order/routes/order";

const BASE_PATH ='/api/v1/order'; //ApiGateway -> OrderService

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
    app.use(`${BASE_PATH}`, verifyGateway, orderRoutes()); 
}