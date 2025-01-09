import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import {start} from "@notification/server";

const log: Logger = winstonLogger('http://localhost:9200', 'notificationApp', 'debug');

function Init(): void{
    const app:Express = express();
    start(app);
    log.info("Notification Service successfully initialized")
}

Init();