import { winstonLogger, BadRequestError} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import { Server, Socket } from 'socket.io';
import { io as ioSocketClient } from 'socket.io-client';
import http from 'http';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { setLoggedUser, removeLoggedUser, getLoggedUsers} from '@gateway/redis';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');

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

const getSocketIO = ():Server =>{
    if(!socketIO){
        throw BadRequestError("Socket hasn't been initialized yet", "socket getSocketIO function");
    }
    return socketIO;
};

const configureSocketEvents = (io: Server):void =>{
    orderSocketServiceConnection(io);

    io.on('connection', async(socket: Socket) => {

        socket.on('getLoggedUsers', async() =>{
            const res = await getLoggedUsers('loggedUsers');
            io.emit('online', res); //emit to 'online' channel
        })

        socket.on('setLoggedUsers', async(username:string) =>{
            const res = await setLoggedUser('loggedUsers', username);
            io.emit('online', res);
        })

        socket.on('removeLoggedUsers', async(username: string) =>{
            const res = await removeLoggedUser('loggedUsers', username);
            io.emit('online', res);
        })

        log.info("GatewayService socket events");
    })
}

const orderSocketServiceConnection = (io:Server):void => {
    const orderSocketClient = ioSocketClient(`${config.ORDER_SERVICE_URL}`, {
        transports: ['websocket', 'polling'],
        secure: true
    })

    orderSocketClient.on('connect', () =>{
        log.info('Order Service socket connected');
    })

    orderSocketClient.on('disconnect', () =>{
        log.error('OrderSocket disconnected ');
        // orderSocketClient.connect();
    });

    //listener on socket.emit from Order Service (on socketIO.emit('order-notify))
    orderSocketClient.on('order-notify', (order, notification) => {
        //when the event is reveived send it directly to the 'client'  
        //client listen on order-notificaton 
        io.emit("order-notification", order, notification);
    })

}

//Second-Part Sass-Iot related
// const iotSocketServiceConnection = (io:Server):void => {

// }

export { configureSocketEvents, initializeSocketIO, getSocketIO }