import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import { start } from "@payment/server";
import { config } from '@payment/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'paymentService', 'debug');

const app:Express = express();
start(app);
log.info("Payment service successfully initialized")