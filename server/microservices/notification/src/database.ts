import { winstonLogger } from '@veckovn/growvia-shared';
import { config } from "@notification/config";
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'NotificationService', 'debug');

export async function mongoDBconnection(): Promise<void> {
    try{
        await mongoose.connect(`${config.DATABASE_URL}`);
        log.info('Notification service connected to mongoDB');
    }
    catch(error){
        log.log('error', "Notification service mongoDB connection error: ", error);
    }
}