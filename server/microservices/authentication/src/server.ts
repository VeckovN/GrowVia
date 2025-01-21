import { Application, NextFunction, Request ,Response, urlencoded, json } from "express";
import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@authentication/config';
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import http from 'http';
import { checkConnection } from "@authentication/elasticsearch";
import { verify } from "jsonwebtoken";
import { appRoutes } from "@authentication/routes";

const Server_port = 4002;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');


//Move it to the shared-library (gateway service use it as well)
interface AuthPayloadInterface {
    id:number,
    username: string,
    email: string,
    iat?: number,
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthPayloadInterface;
        }
    }
}

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

function errorHandlerMiddleware(app: Application):void{
    app.use('*', (req:Request, res:Response, next:NextFunction) =>{
        log.log('error', "That endpoint doesn't exist. ");
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        res.status(404).json({message:`The endpoint required doesn't exist: ${fullUrl}`});
        next();
    })

    //CREATE INTERFACE FOR CUSTOM ERRORS (Error class that will be extends with other abstract classe ("CustomErro", "BadRequestError") and others)
    //this used for 'custom error' (that we've created)
    // app.use(() =>{

    // })
}


async function startHttpAndSocketServer(app:Application):Promise<void> {
    try{
        log.info("Gateway service has started");

        const httpServer: http.Server = new http.Server(app);
        httpServer.listen(Server_port, ()=>{
            log.info(`Gateway service is running on port: ${Server_port}`)
        })

        //Start SocketIO server
        // const socketServer = 
    }
    catch(error){
        log.log("error", "Gatawey service startServer failed: ", error);
    }
}

export function start(app:Application){
    //Secure part (something like secureMiddleware)
    app.set('trust proxy', 1); 
    app.use(helmet());
    app.use(cors({
        //request comes from Api_Gateway (not direct from the client)
        //client -> ApiGateway  ==> ApiGateway -> AuthService
        origin: config.API_GATEWAY_URL,
        credentials: true, //enable to detach the JTW Token to every request comming from the client
        methods:['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }))

    //JWT_TOKEN (not "GATEWAY_JWT_TOKEN") will be attached on every request from the client

    //From API_GATEWAY the token JWT_TOKE will be add in 'authorization' (for Looged USER) something like:
    // 'Bearer 12312312312312312' =>  split it -> [0]=Bearer [1]= 12312312312312312

    //So every request that is comming from API_GATEWAY we have to check authorization header does token exist (Bearer token )
    //If the token doesn't exist then throw error( go with next() as well) and request won't be allowed
    //If the token exist then verify it set the payload to 'currentUser' req property 
    app.use((req:Request, _res:Response, next: NextFunction) =>{
        //check does JWT_TOKEN exist in authorization header
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1];
            //then we do token verification
            const payload:AuthPayloadInterface = verify(token, `${config.JWT_TOKEN}`)as AuthPayloadInterface;
            req.currentUser = payload;
        }
        next();
    })

    compressRequestMiddleware(app);
    routesMiddleware(app);
    startElasticsearch();
    errorHandlerMiddleware(app);

    // startServers(app);
    startHttpAndSocketServer(app);
}

