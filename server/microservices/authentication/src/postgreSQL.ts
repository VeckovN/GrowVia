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


const authUserTable = `
    CREATE TABLE IF NOT EXISTS public.auths (
        username text NOT NULL,
        password text NOT NULL,
        email text NOT NULL UNIQUE,
        cloudinaryProfilePublicId text NOT NULL, 
        profilePicture text NOT NULL, 
        verificatioEmailToken text, 
        resetPasswordToken text,
        exipresResetPassword timestamp,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (username)
    );

    CREATE UNIQUE INDEX idx_email ON public.auths (email);

    CREATE INDEX idx_username ON public.auths (username);
`
//createdAt timestamp DEFAULT CURRENT_DATE

//cloudinaryProfilePublicId -> public id of uploaded image
//profilePicture - img url (after uploading)

// verificatioEmailToken -> when user create account the token will be stored. 
//when user verify their email this field will be set on NULL
//IF we wan't to check is user verified his email we will check does verificatioEmailToken is NULL

export async function connectPool():Promise<void> {
    try{
        await pool.connect();
        //create initial tables
        await pool.query(authUserTable);
        log.info("Authenticatio Service connected to postgreSQL DB");
    }
    catch(error){
        log.error("Auhtentication Service can't connect to postgreSQL DB");
        log.log("error", "Authentication Service postgreSQL connection failed: ", error);
    }
} 