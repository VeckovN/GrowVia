import { winstonLogger  } from '@veckovn/growvia-shared';
import { config } from "@users/config";
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'usersService', 'debug');

export async function mongoDBconnection(): Promise<void> {
    try{
        await mongoose.connect(`${config.DATABASE_URL}`);
        log.info('User service connected to mongoDB');
    }
    catch(error){
        log.log('error', "UserService mongoDB connection error: ", error);
    }
}