//pg.Client is create client once
//pg.Pool is initially created empty and will create new clients lazily as they are needed
import { winstonLogger } from '@veckovn/growvia-shared';
import { Logger } from 'winston';
import { config } from '@authentication/config';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

const pool:Pool = new Pool({
    user: `${config.POSTGRESQL_USER}`,
    password: `${config.POSTGRESQL_PASSWORD}`,
    host: `${config.POSTGRESQL_HOST}`,
    port: 5432,
    database: `${config.POSTGRESQL_NAME}`,
})

//listen on Error event (Pooling)
pool.on('error', (err: Error) => {
    log.log("error", "Client PG(PostgreSQL) error: ", err.message);
    process.exit(-1); 
})

export async function connectPool():Promise<void> {
    try{
        await pool.connect();
        log.info("Authenticatio Service connected to postgreSQL DB");
    }
    catch(error){
        log.error("Auhtentication Service can't connect to postgreSQL DB");
        log.log("error", "Authentication Service postgreSQL connection failed: ", error);
    }
} 
