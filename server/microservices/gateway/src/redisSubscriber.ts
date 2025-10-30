import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@gateway/config';
import { createClient } from 'redis';
import { CacheInvalidationEventInterface, CacheInvalidationMetadata } from "@veckovn/growvia-shared";
import { cacheDelete, isFarmerInCache, isProductInCache} from "./redis";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'gatewayRedisService', 'debug');
type redisClientType = ReturnType<typeof createClient>;

let subscriberClient: redisClientType | null = null;

const initializeCacheSubscriber = async(): Promise<void> =>{
    try{
        subscriberClient = createClient({ url: config.REDIS_HOST });

        subscriberClient.on('error', (error) => {
            log.error('Cache subscriber error:', error);
        });

        await subscriberClient.connect();
        log.info('Cache Subscriber connected');

        await subscriberClient.subscribe('cache:invalidate', async (message) => {
            await handleCacheInvalidation(message);
        });

        log.info('Subscribed to cache:invalidate channel');
    }
    catch(error){
        log.error('Failed to initialize cache subscriber:', error);
        throw error;
    }
}

const handleCacheInvalidation = async(message: string): Promise<void> => {
    try{

        const event: CacheInvalidationEventInterface = JSON.parse(message);

        log.info(`Cache invalidation from ${event.service}`, {
            keys: event.keys,
            timestamp: new Date(event.timestamp).toISOString(),
            metadata: event.metadata
        });

        for(const key of event.keys) {
            await invalidateCacheKeyConditionally(key, event.metadata);
        }
    }
    catch(error){
        log.error('Error processing cache invalidation:', error);
    }
}

const invalidateCacheKeyConditionally = async(key: string, metadata?: CacheInvalidationMetadata): Promise<void> => {
    try{
        if(key === 'newest:farmers' && metadata?.farmerID){
            const shouldInvalidate = await isFarmerInCache(key, metadata.farmerID);
        
            if(!shouldInvalidate){
                log.info(`Farmer ${metadata.farmerID} not in cache '${key}', skipping invalidation`);
                return;  // Skip invalidation
            }

            log.info(`Farmer ${metadata.farmerID} found in cache '${key}', invalidating...`);

        } 

        if(key === 'newest:products' && metadata?.productID){
            const shouldInvalidate = await isProductInCache(key, metadata.productID);
            
            if (!shouldInvalidate) {
                log.info(`Product ${metadata.productID} not in cache '${key}', skipping invalidation`);
                return;  // Skip invalidation
            }
            
            log.info(`Product ${metadata.productID} found in cache '${key}', invalidating...`);
        }

        const deleted = await cacheDelete(key);
    
        if (deleted > 0) {
            log.info(`Invalidated cache key: ${key}`);
        } else {
            log.info(`Cache key '${key}' not found (already expired)`);
        }
    }
    catch(error){
        log.error(`Failed to invalidate cache key ${key}:`, error);
        //On error, invalidate anyway to be safe
        await cacheDelete(key);
    }
}

const disconnectCacheSubscriber = async(): Promise<void> => {
    if (subscriberClient && subscriberClient.isOpen) {
        await subscriberClient.quit();
        log.info('Cache subscriber disconnected');
        subscriberClient = null;
    }
}

const isCacheSubscriberReady = (): boolean => {
    return subscriberClient !== null && subscriberClient.isOpen;
}

export {
    initializeCacheSubscriber,
    handleCacheInvalidation,
    disconnectCacheSubscriber,
    isCacheSubscriberReady
}