import {io, Socket} from 'socket.io-client';

let socket: Socket | null = null;

const VITE_BASE_ENDPOINT='http://localhost:4000'; //Backend endpoint -> Gateway Service

export const connectSocket = () => {
    if(socket) return socket; //only one instance ->

    // socket = io(import.meta.env.VITE_BASE_ENDPOINT , { //importing from .env
    socket = io(VITE_BASE_ENDPOINT , {
        transports: ['websocket'],
        // secure:true, //only for 'https or wss
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
    })

    registerSocketEvents(socket);
    
    return socket;

}

const registerSocketEvents = (sock: Socket) => {
    sock.on('connect', () => {
        console.log('Connected to server');
    });

    sock.on('disconnect', (reason: Socket.DisconnectReason) => {
        console.warn(`Disconnected: ${reason}`);
        // Example: handle specific cases manually
        if (reason === 'io server disconnect') {
            // Server disconnected us, so reconnect manually
            sock.connect();
        }
        // Otherwise, auto-reconnect will kick in
    });

    sock.on('connect_error', (error: Error) => {
        console.error(`Connection error: ${error.message}`);
        // Auto-reconnect handles most cases
    });

    sock.on('error', (error) => {
        console.error('Unhandled socket error:', error);
    });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket){
        socket.disconnect();
        socket = null;
    }
}