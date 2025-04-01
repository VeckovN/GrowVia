import { winstonLogger, BadRequestError} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import { Server, Socket } from 'socket.io';
// import { io as ioSocketClient, Socket as clientSocket } from 'socket.io-client';
import { io as ioSocketClient } from 'socket.io-client';
import http from 'http';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { setSelectedProductCategory, setLoggedUser, removeLoggedUser, getLoggedUsers} from '@gateway/redis';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');

//other service Connections methods

let socketIO: Server;

const initializeSocketIO = async (httpServer: http.Server): Promise<void> => {
    try{
        socketIO = new Server(httpServer, {
            cors:{
                origin: `${config.CLIENT_URL}`,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
            }
        }) 

        //configure redis-adapter (connect to redis)
        const pubClient = createClient({ url: config.REDIS_HOST})
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]); //wait both to be executed
        socketIO.adapter(createAdapter(pubClient, subClient));

        log.info("Socket Initialized successfully");
    }
    catch(error){
        log.error("GatewayService socket initializaion error: ", error);
    }
}

//singleton
const getSocketIO = ():Server =>{
    if(!socketIO){
        throw BadRequestError("Socket hasn't been initialized yet", "socket getSocketIO function");
    }
    return socketIO;
};



const configureSocketEvents = (io: Server):void =>{
    // //Services Socket Connections:
    //Connect to external services
    orderSocketServiceConnection(io);
    
    //client connections (origin -> CLIENT_URL)
    io.on('connection', async(socket: Socket) => {
        socket.on('category', async(category: string, username:string) => { 
            await setSelectedProductCategory(`selectedCategory:${username}`, category)
        })

        socket.on('getLoggedUsers', async() =>{
            const res = await getLoggedUsers('loggedUsers');
            io.emit('online', res); //emit to 'online' channel
        })

        socket.on('setLoggedUsers', async(username:string) =>{
            const res = await setLoggedUser('loggedUsers', username);
            io.emit('online', res);
        })

        socket.on('removeLoggedUser', async(username: string) =>{
            const res = await removeLoggedUser('loggedUsers', username);
            io.emit('online', res);
        })

        log.info("GatewayService socket events");
    })
}

const orderSocketServiceConnection = (io:Server):void => {
    //connection for order SErvice
    // const orderSocketClient = io(`${config.ORDER_SERVICE_URL}`, {
    const orderSocketClient = ioSocketClient(`${config.ORDER_SERVICE_URL}`, {
        transports: ['websocket', 'polling'],
        secure: true
    })

    orderSocketClient.on('connect', () =>{
        log.info('OrderService socket connected');
    })

    orderSocketClient.on('disconnect', () =>{
        log.error('OrderSocket disconnected ');
        // orderSocketClient.connect();
    });

    //listener on socket.emit from Order Notification
    orderSocketClient.on('order notify', (order, notification) => {
        //when the event is reveived send it directly to the 'client'  
        io.emit("order notification", order, notification);
    })

}

export { configureSocketEvents, initializeSocketIO, getSocketIO }