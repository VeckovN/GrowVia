import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import { Server, Socket } from 'socket.io';
// import { io, Socket as clientSocket } from 'socket.io-client';
// import { io } from 'socket.io-client';
import { setSelectedProductCategory, setLoggedUser, removeLoggedUser, getLoggedUsers} from '@gateway/redis';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayService', 'debug');


// const orderSocketServiceConnection(io:Server):void {
//     //connection for order SErvice
//     const orderSocketClient = io(`${config.ORDER_SERVICE_URL}`, {
//         transports: ['websocket', 'polling'],
//         secure: true
//     })

//     orderSocketClient.on('event...', () =>{

//     })
// }

//other service Connections methods


const configureSocketEvents = (io: Server):void =>{
    // //Services Socket Connections:
    // orderSocketServiceConnection(io);
    
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

export { configureSocketEvents }