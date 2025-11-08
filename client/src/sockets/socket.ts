import {io, Socket} from 'socket.io-client';

const VITE_BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINT; //Backend endpoint -> Gateway Service
let socket: Socket | null = null;

export const connectSocket = () => {
    if(socket) return socket; //only one instance ->

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
    });

    sock.on('connect_error', (error: Error) => {
        console.error(`Connection error: ${error.message}`);
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