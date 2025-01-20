import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import {start} from "@gateway/server";
import { config } from '@gateway/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');

function Init(): void{
    const app:Express = express();
    start(app);
    
    log.info("Gateway service successfully initialized")
}

Init();