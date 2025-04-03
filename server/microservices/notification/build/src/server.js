"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const http_1 = __importDefault(require("http"));
const growvia_shared_1 = require("@veckovn/growvia-shared");
const express_1 = require("express");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("./config");
const routes_1 = require("./routes");
const elasticsearch_1 = require("./elasticsearch");
const rabbitmq_1 = require("./rabbitmqQueues/rabbitmq");
const database_1 = require("./database");
const emailConsumer_1 = require("./rabbitmqQueues/emailConsumer");
const Server_port = 4001;
const log = (0, growvia_shared_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'notificationService', 'debug');
function compressRequestMiddleware(app) {
    app.use((0, compression_1.default)());
    app.use((0, express_1.json)({
        limit: '200mb',
    }));
    app.use((0, express_1.urlencoded)({
        limit: '200mb',
        extended: true
    }));
}
function routesMiddleware(app) {
    (0, routes_1.appRoutes)(app);
}
function startElasticsearch() {
    (0, elasticsearch_1.checkConnection)();
}
function startMongoDB() {
    (0, database_1.mongoDBconnection)();
}
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        //create channel for AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer
        const emailChannel = yield (0, rabbitmq_1.createConnection)();
        yield (0, emailConsumer_1.AuthEmailConsumer)(emailChannel);
        yield (0, emailConsumer_1.OrderEmailConsumer)(emailChannel);
        yield (0, emailConsumer_1.PaymentEmailConsumer)(emailChannel);
    });
}
function errorHandlerMiddleware(app) {
    app.use((error, _req, res, next) => {
        if (error.statusCode) {
            log.log('error', `Notification Service Error:`, error);
            res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode,
                status: error.status,
                comingFrom: error.comingFrom
            });
        }
        // else if(isAxiosError(error))
        //handle axios errors() -> comes from ApiGateway
        next();
    });
}
function startHttpServer(app) {
    try {
        const server = new http_1.default.Server(app);
        log.info(`Notification service starting, process ID:${process.pid}`);
        server.listen(Server_port, () => {
            log.info(`Notification service is running on port: ${Server_port}`);
        });
    }
    catch (err) {
        log.log('error', 'Notification service running error ', err);
    }
}
function start(app) {
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.config.API_GATEWAY_URL,
        credentials: true, //enable to detach the JTW Token to every request comming from the client
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }));
    app.use((req, _res, next) => {
        //check does JWT_TOKEN exist in authorization header
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const payload = (0, jsonwebtoken_1.verify)(token, `${config_1.config.JWT_TOKEN}`);
            req.currentUser = payload;
        }
        next();
    });
    compressRequestMiddleware(app);
    routesMiddleware(app);
    startElasticsearch();
    startMongoDB();
    startQueues();
    errorHandlerMiddleware(app);
    startHttpServer(app);
}
//# sourceMappingURL=server.js.map