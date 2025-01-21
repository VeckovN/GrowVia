import { Application } from "express";
import { healthRoutes } from "@authentication/routes/health";

export function appRoutes(app:Application): void {
    app.use('', healthRoutes()); 
}