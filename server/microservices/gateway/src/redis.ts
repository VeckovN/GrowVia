import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import { createClient } from 'redis';

type redisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayRedisService', 'debug');
const client: redisClient = createClient({ url: `${config.REDIS_HOST}`});

const redisConnect = async():Promise<void> =>{
    try{
        await client.connect();
        log.info("GatewayService Redis Connection");

        client.on('error', (error: unknown) =>{
            log.error(error);
        });
    } 
    catch(error) {
        log.log('error', 'GatewayService Redis Connection error: ', error);
    }
};

const setSelectedProductCategory = async(key: string, value:string): Promise<void> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        //for example { key='category' }
        await client.SET(key, value);
    }  
    catch(error){
        log.log('error', 'GatewayService Catch set selected product category error: ', error);
    }
}

//set user to catch
const setLoggedUser = async(key: string, value:string): Promise<string[]> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        //check if user isn't in 'key'set(logged)
        const index: number | null = await client.LPOS(key, value);
        if(index === null){
            //push logged user('username' at the head of the list)
            await client.LPUSH(key, value);
            log.info(`User ${value} added to the online users list`);
        }

        //get all users from list (0, -1)
        const res: string[] = await client.LRANGE(key, 0, -1);
        return res; //return Promise<string[]>
    }  
    catch(error){
        log.log('error', 'GatewayService Catch setLoggedUser error: ', error);
        return [];
    }
}

const removeLoggedUser = async(key: string, value:string): Promise<string[]> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        await client.LREM(key, 1, value);
        log.info(`User ${value} removed from the online users list`);
        const res: string[] = await client.LRANGE(key, 0, -1);
        return res;
    }  
    catch(error){
        log.log('error', 'GatewayService Catch removeLoggedUser error: ', error);
        return [];
    }
}

const getLoggedUsers = async(key: string): Promise<string[]> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        const res: string[] = await client.LRANGE(key, 0, -1);
        return res;
    }  
    catch(error){
        log.log('error', 'GatewayService Catch getLoggedUsers error: ', error);
        return [];
    }
}


export { 
    client,
    redisConnect,
    setSelectedProductCategory,
    setLoggedUser,
    removeLoggedUser,
    getLoggedUsers
};
