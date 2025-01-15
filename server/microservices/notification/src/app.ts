import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import {start} from "@notification/server";
import { config } from '@notification/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationApp', 'debug');

function Init(): void{
    const app:Express = express();
    start(app);
    log.info("Notification Service successfully initialized")
}

Init();