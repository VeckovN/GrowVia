import { FarmerDocumentInterface, ProductDocumentInterface, winstonLogger} from "@veckovn/growvia-shared";
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

const setLoggedUser = async(key: string, value:string): Promise<string[]> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        const index: number | null = await client.LPOS(key, value);
        if(index === null){
            await client.LPUSH(key, value);
            log.info(`User ${value} added to the online users list`);
        }

        const res: string[] = await client.LRANGE(key, 0, -1);
        return res;
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

const cacheSet = async <T>(key: string, value: T, ttlSeconds: number):Promise<void> =>{
    try{
        if(!client.isOpen)
            await client.connect();

        await client.setEx(key, ttlSeconds, JSON.stringify(value));
    }
    catch(error){
        log.log('error', 'GatewayService Cache SET error: ', error);
    }
}

const cacheGet = async <T>(key: string): Promise<T | null> => {
    try{
        if(!client.isOpen)
            await client.connect();

        const cached = await client.get(key);
        if(!cached){
            return null;
        }

        return JSON.parse(cached) as T;
    }
    catch(error){
        log.log('error', 'GatewayService Cache GET error: ', error);
        return null;
    }
}

const cacheDelete = async (key: string): Promise<number> => {
    try {
        if (!client.isOpen) await client.connect();
        const deleted = await client.del(key)
        return deleted;
    } catch (error) {
        log.error(`Cache DELETE error for Key ${key}:`, error);
        return 0;
    }
};

const isFarmerInCache = async(cachedKey: string, farmerID:string): Promise<boolean> => {
    try{
        const cachedData = await client.get(cachedKey);

        if(!cachedData)
            return false

        const parsedCache = JSON.parse(cachedData);
        const farmers = parsedCache.farmers || [];

        const found = farmers.some((f: FarmerDocumentInterface) => f.userID === farmerID)
        return found;
    }   
    catch(error) {
        log.error(`Finding Farmer in Cache error for Key ${cachedKey}:`, error);
        return false
    }
}

const isProductInCache = async(cachedKey: string, productID:string): Promise<boolean> => {
    try{
        const cachedData = await client.get(cachedKey);

        if(!cachedData)
            return false

        const parsedCache = JSON.parse(cachedData);
        const products = parsedCache.products || [];
    
        const found = products.some((f: ProductDocumentInterface) => f._id === productID)
        return found;
    }
    catch(error) {
        log.error(`Finding Customer in Cache error for Key ${cachedKey}:`, error);
        return false
    }
}

export { 
    client,
    redisConnect,
    setLoggedUser,
    removeLoggedUser,
    getLoggedUsers,
    cacheSet,
    cacheGet,
    cacheDelete,
    isFarmerInCache,
    isProductInCache

};
