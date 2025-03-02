import { winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from '@product/config';
import { createClient } from 'redis';

type redisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productRedisService', 'debug');
const client: redisClient = createClient({ url: `${config.REDIS_HOST}`});

const redisConnect = async():Promise<void> =>{
    try{
        await client.connect();
        log.info("ProductService Redis Connection");

        client.on('error', (error: unknown) =>{
            log.error(error);
        });
    } 
    catch(error) {
        log.log('error', 'ProductService Redis Connection error: ', error);
    }
};

export { redisConnect, client};
