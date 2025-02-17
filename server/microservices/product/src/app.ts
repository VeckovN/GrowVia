import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import express, { Express } from "express";
import { start } from "@product/server";
import { config } from '@product/config';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productService', 'debug');

const app:Express = express();
start(app);
log.info("Product service successfully initialized")