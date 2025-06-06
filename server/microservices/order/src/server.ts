import { winstonLogger, AuthPayloadInterface, CustomErrorInterface } from "@veckovn/growvia-shared";
import { Application, NextFunction, Request ,Response, urlencoded, json } from "express";
import 'express-async-errors';
import { Logger } from "winston";
import { config } from '@order/config';
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import http from 'http';
import { checkConnection } from '@order/elasticsearch';
import { verify } from "jsonwebtoken";
import { connectPool } from "@order/postgreSQL";
import { appRoutes } from "@order/routes";
import { createConnection } from "@order/rabbitmqQueues/rabbitmq";
import { Channel } from "amqplib";
import { Server } from 'socket.io';
import { placeOrderPaymentDirectConsumer, farmerAcceptOrderPaymentDirectConsumer } from "@order/rabbitmqQueues/consumer";
// import { placeOrderPaymentDirectConsumer } from "@order/rabbitmqQueues/consumer";
const Server_port = 4005;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'OrderService', 'debug');

let orderChannel:Channel;
let orderSocketIO: Server;

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


function startPostgreSQL():void{
    connectPool();
}

async function startRabbitmqQueue():Promise<void>{
    // //create OrderChannel (consuming/listening):
    //create cosuming from payment service:
    orderChannel = await createConnection() as Channel;
    await placeOrderPaymentDirectConsumer(orderChannel);
    await farmerAcceptOrderPaymentDirectConsumer(orderChannel);
} 

function errorHandlerMiddleware(app: Application):void{
    app.use((error: CustomErrorInterface, _req: Request, res: Response, next: NextFunction) => {
        if(error.statusCode){
            log.log('error', `Order Service Error:`, error);
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
        log.info("Order service has started");

        const httpServer: http.Server = new http.Server(app);
        const socketIO: Server = await createSocketIO(httpServer);

        httpServer.listen(Server_port, ()=>{
            console.log("Order Service started");
            log.info(`Order service is running on port: ${Server_port}`)
        })

        orderSocketIO = socketIO;

        log.info("Order service has started");
    }
    catch(error){
        log.log("error", "Order service startServer failed: ", error);
    }
}

async function createSocketIO(httpServer: http.Server): Promise<Server> {
    const socketIO: Server = new Server(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
        }
      });
      return socketIO;
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
    startPostgreSQL();
    startRabbitmqQueue();
    errorHandlerMiddleware(app);
    startHttpAndSocketServer(app);
}


export { orderChannel, orderSocketIO }