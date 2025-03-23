import { Application, json, NextFunction, Request ,Response, urlencoded } from "express";
import { winstonLogger, CustomErrorInterface} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import cookieSession from "cookie-session";
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import http from 'http';
// import { Server } from 'socket.io';
// import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from "redis";
import { initializeSocketIO, getSocketIO, configureSocketEvents } from '@gateway/sockets';
import { checkConnection } from "@gateway/elastisearch";
import { redisConnect } from "@gateway/redis";
import { appRoutes } from "@gateway/routes";
import { notificationAxiosInstance } from "@gateway/services/notification.service";
import { authAxiosInstance } from "@gateway/services/auth.service";
import { usersAxiosInstance } from "@gateway/services/user.service";
import { productAxiosInstance } from "@gateway/services/product.service";
import { orderAxiosInstance } from "@gateway/services/order.service";

const Server_port = 4000;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');

//middleware used to compress request to small size
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

function startRedis():void{
    redisConnect();
}

function errorHandlerMiddleware(app: Application):void{
    //this '*' means if the user use some endpoint that doesn't exist
    app.use('*', (req:Request, res:Response, next:NextFunction) =>{
        log.log('error', "That endpoint doesn't exist. ");
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        res.status(404).json({message:`The endpoint required doesn't exist: ${fullUrl}`});
        next();
    })

    app.use((error: CustomErrorInterface, _req: Request, res: Response, next: NextFunction) => {
        console.log("error From Middleware: ", error);
        if(error.statusCode){
            log.log('error', `Gateway Service Error:`, error);
            res.status(error.statusCode).json({
                message:error.message,
                statusCode: error.statusCode,
                status: error.status,
                comingFrom: error.comingFrom
            });
        }

        //AxiosError
        next();
    });

}

async function startServers(app:Application):Promise<void> {
    try{
        log.info("Gateway service has started");
        //Start HTTP server
        const httpServer: http.Server = new http.Server(app);
        httpServer.listen(Server_port, ()=>{
            log.info(`Gateway service is running on port: ${Server_port}`)
        })

        //start Socket server
        await initializeSocketIO(httpServer);
        const socketIO = getSocketIO(); 
        configureSocketEvents(socketIO);
    }
    catch(error){
        log.log("error", "Gatawey service startServer failed: ", error);
    }
}

export function start(app:Application):void {
    
    //the gateway acts as a proxy by manually forwarding requests, 
    //but trust proxy ensures the gateway and any downstream services handle headers like X-Forwarded-For and X-Forwarded-Proto correctly.
    app.set('trust proxy', 1);

    //store session JWT Token in cookie
    app.use(
        cookieSession({
            name:"session", 
            keys:[`${config.FIRST_SECRET_KEY}`, `${config.SECOND_SECRET_KEY}`], //keys are 'secret keys' will be added later
            maxAge: 24 * 3 *3600000, //3 days
            // secure:false //for local development is FALSE (use config value to set false/true based on Dev/Prod state)
            secure: config.NODE_ENV != "development"  //true if development
            //sameSite: none //for production
        })
    )

    app.use(helmet());
    app.use(cors({
        origin: config.CLIENT_URL,
        credentials: true, //enable to detach the JTW Token to every request comming from the client
        methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }))

    //When the request comes from the frontend and before the API_Gateway sends(redirect) request to the respective Service 
    //the token will be add to the headers (jwt token)
    app.use((req: Request, _res:Response, next:NextFunction) =>{
        console.log("REQ>SESSION : ", req.session);
        if(req.session?.jwtToken){   //if session exist (The user is logged)
            //we want to append bearer token to the each AXIOS INSTANCE (Auth, Product, User, Order ...)
            notificationAxiosInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwtToken}`
            authAxiosInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwtToken}`
            usersAxiosInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwtToken}`
            productAxiosInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwtToken}`
            orderAxiosInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwtToken}`
        }
        next();
    })

    compressRequestMiddleware(app);
    routesMiddleware(app);
    startElasticsearch();
    startRedis();
    errorHandlerMiddleware(app);
    startServers(app);
}