import { winstonLogger, AuthPayloadInterface, CustomErrorInterface } from "@veckovn/growvia-shared";
import { Application, NextFunction, Request ,Response, urlencoded, json } from 'express';
import 'express-async-errors';
import http from 'http';
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import { Logger } from "winston";
import { Channel } from "amqplib";
import { verify } from "jsonwebtoken";
import { config } from '@notification/config';
import { appRoutes } from "@notification/routes";
import { checkConnection } from "@notification/elasticsearch";
import { createConnection } from "@notification/rabbitmqQueues/rabbitmq";
import { mongoDBconnection } from '@notification/database';
import { AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer } from "./rabbitmqQueues/emailConsumer";

const Server_port = 4001;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationService', 'debug');


function compressRequestMiddleware(app:Application):void {
    app.use(compression());
    app.use(json({
        limit: '200mb',
    }))
    app.use(urlencoded({ 
        limit: '200mb',
        extended: true
    }))
}

function routesMiddleware(app:Application):void{
    appRoutes(app);
}

function startElasticsearch():void{
    checkConnection();
}

function startMongoDB():void{
    mongoDBconnection();
}

async function startQueues(): Promise<void>{
    //create channel for AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer
    const emailChannel:Channel = await createConnection() as Channel;
    await AuthEmailConsumer(emailChannel);
    await OrderEmailConsumer(emailChannel);
    await PaymentEmailConsumer(emailChannel);
}

function errorHandlerMiddleware(app: Application):void{
    app.use((error: CustomErrorInterface, _req: Request, res: Response, next: NextFunction) => {
        if(error.statusCode){
            log.log('error', `Notification Service Error:`, error);
            res.status(error.statusCode).json({
                message:error.message,
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


function startHttpServer(app: Application):void {
    try{
        const server: http.Server = new http.Server(app);
        log.info(`Notification service starting, process ID:${process.pid}`);
        server.listen(Server_port, () =>{
            log.info(`Notification service is running on port: ${Server_port}`);
        })
    }
    catch (err){
        log.log('error', 'Notification service running error ', err);
    }
}

export function start(app:Application){
    app.set('trust proxy', 1); 
    app.use(helmet());
    app.use(cors({
        origin: config.API_GATEWAY_URL,
        credentials: true, //enable to detach the JTW Token to every request comming from the client
        methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }))

    app.use((req:Request, _res:Response, next: NextFunction) =>{
        //check does JWT_TOKEN exist in authorization header
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1];
            const payload:AuthPayloadInterface = verify(token, `${config.JWT_TOKEN}`)as AuthPayloadInterface;
            req.currentUser = payload;
        }
        next();
    })

    compressRequestMiddleware(app);
    routesMiddleware(app);
    startElasticsearch();
    startMongoDB();
    startQueues();
    errorHandlerMiddleware(app);
    startHttpServer(app);
}