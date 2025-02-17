import { winstonLogger } from '@veckovn/growvia-shared';
import { config } from "@product/config";
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'productService', 'debug');

export async function mongoDBconnection(): Promise<void> {
    try{
        await mongoose.connect(`${config.DATABASE_URL}`);
        log.info('Product service connected to mongoDB');
    }
    catch(error){
        log.log('error', "Product service mongoDB connection error: ", error);
    }
}