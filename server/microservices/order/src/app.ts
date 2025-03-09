import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import { start } from "@order/server";
import { config } from '@order/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'orderService', 'debug');

const app:Express = express();
start(app);
log.info("Order service successfully initialized")