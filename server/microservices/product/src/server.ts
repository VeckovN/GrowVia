import { Application, NextFunction, Request ,Response, urlencoded, json } from "express";
import { winstonLogger, AuthPayloadInterface, CustomErrorInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@product/config';
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import http from 'http';
import { checkConnection, createIndex} from "@product/elasticsearch";
import { redisConnect } from "@product/redis";
import { verify } from "jsonwebtoken";
import { mongoDBconnection } from "@product/database";
import { appRoutes } from "@product/routes";
import { createConnection } from "@product/rabbitmqQueues/rabbitmq";
import { Channel } from "amqplib";
const Server_port = 4004;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'ProductService', 'debug');

let productChannel:Channel;

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
    createIndex('products');
}

function startRedis():void{
    redisConnect();
}

function startMongoDB():void{
    mongoDBconnection();
}

async function startRabbitmqQueue():Promise<void>{
    // //create ProductChannel (consuming/listening):
    productChannel = await createConnection() as Channel;
} 

function errorHandlerMiddleware(app: Application):void{
    app.use((error: CustomErrorInterface, _req: Request, res: Response, next: NextFunction) => {
        if(error.statusCode){
            log.log('error', `Product Service Error:`, error);
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

async function startHttpAndSocketServer(app:Application):Promise<void> {
    try{
        log.info("Product service has started");

        const httpServer: http.Server = new http.Server(app);
        httpServer.listen(Server_port, ()=>{
            console.log("Product Service started");
            log.info(`Product service is running on port: ${Server_port}`)
        })

        //Start SocketIO server
        // const socketServer = 
    }
    catch(error){
        log.log("error", "Product service startServer failed: ", error);
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
    startRedis();
    startMongoDB();
    startRabbitmqQueue();
    errorHandlerMiddleware(app);
    startHttpAndSocketServer(app);
}


export { productChannel }