import { Application, NextFunction, Request ,Response, urlencoded, json } from "express";
import { winstonLogger, AuthPayloadInterface, CustomErrorInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@users/config';
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import http from 'http';
import { checkConnection } from "@users/elasticsearch";
import { verify } from "jsonwebtoken";
import { mongoDBconnection } from "@users/database";
import { appRoutes } from "@users/routes";
// import { createConnection } from "@users/rabbitmqQueues/rabbitmq";
// import { Channel } from "amqplib";

const Server_port = 4002;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'usersService', 'debug');

function compressRequestMiddleware(app:Application):void {
    app.use(compression());
    app.use(json({
        limit: '200mb', //max size of the JSON request
    }))
    app.use(urlencoded({ //to enable passing request to 'body' (req.body)
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

async function startRabbitmqQueue():Promise<void>{
    //create userChannel (consuming/listening):
    // const userChannel:Channel = await createConnection() as Channel;
    //AuthenticationService - on create user 
    // await cosumeUsersDirectMessage(userChannel); //for consuming create data on Authentication service)
    //OrderService - on creating order and others.
    //ProductService -
} 

function errorHandlerMiddleware(app: Application):void{
    app.use((error: CustomErrorInterface, _req: Request, res: Response, next: NextFunction) => {
        if(error.statusCode){
            log.log('error', `Users Service Error:`, error);
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
        log.info("Users service has started");

        const httpServer: http.Server = new http.Server(app);
        httpServer.listen(Server_port, ()=>{
            console.log("User Service started");
            log.info(`Users service is running on port: ${Server_port}`)
        })

        //Start SocketIO server
        // const socketServer = 
    }
    catch(error){
        log.log("error", "Users service startServer failed: ", error);
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
    startRabbitmqQueue();
    errorHandlerMiddleware(app);
    startHttpAndSocketServer(app);
}
