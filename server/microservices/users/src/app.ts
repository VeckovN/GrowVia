import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import { start } from "@users/server";
import { config } from '@users/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

const app:Express = express();
start(app);
log.info("Users service successfully initialized")