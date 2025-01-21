import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
// import {start} from "@gateway/server";
import { config } from '@authentication/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

function Init(): void{
    const app:Express = express();
    // start(app);
    
    log.info("Authentication service successfully initialized")
}

Init();