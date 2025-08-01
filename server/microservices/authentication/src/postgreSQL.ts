//By default, PostgreSQL converts all column names to lowercase 

//pg.Client is create client once
//pg.Pool is initially created empty and will create new clients lazily as they are needed
import { winstonLogger } from '@veckovn/growvia-shared';
import { Logger } from 'winston';
import { config } from '@authentication/config';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');
const isDocker = config.RUNNING_IN_DOCKER === '1';

const pool:Pool = new Pool({
    user: `${config.POSTGRESQL_USER}`,
    password: `${config.POSTGRESQL_PASSWORD}`,
    host: isDocker ? config.POSTGRESQL_HOST : '',
    port: 5432,
    database: `${config.POSTGRESQL_NAME}`,
})

pool.on('error', (err: Error) => {
    log.log("error", "Client PG(PostgreSQL) error: ", err.message);
    process.exit(-1); 
})

const authUserTable = `
    CREATE TABLE IF NOT EXISTS public.auths (
        id SERIAL UNIQUE,
        username text NOT NULL,
        password text NOT NULL,
        email text NOT NULL UNIQUE,
        userType text NOT NULL,
        verificationEmailToken text, 
        resetPasswordToken text,
        expiresResetPassword timestamp,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (username)
    );

   DO $$
        BEGIN
            -- Create index on email if it does not exist
            IF NOT EXISTS (
                SELECT 1
                FROM pg_indexes
                WHERE schemaname = 'public' AND indexname = 'idx_email'
            ) THEN
                CREATE UNIQUE INDEX idx_email ON public.auths (email);
        END IF;

            -- Create index on username if it does not exist
        IF NOT EXISTS (
            SELECT 1
            FROM pg_indexes
            WHERE schemaname = 'public' AND indexname = 'idx_username'
        ) THEN
            CREATE INDEX idx_username ON public.auths (username);
        END IF;
    END $$;
        
    -- CREATE UNIQUE INDEX idx_email ON public.auths (email);
    -- CREATE INDEX idx_username ON public.auths (username);

    DO $$
    BEGIN 
        IF NOT EXISTS (SELECT FROM information_schema.views 
                    WHERE table_name = 'auths_user_without_password') THEN
            CREATE VIEW public.auths_user_without_password AS
                SELECT id, username, email, userType, verificationEmailToken, 
                    resetPasswordToken, expiresResetPassword, createdAt
                FROM public.auths;
        END IF;
    END $$;
`
//Like this, because the CREATE VIEW doesn't support the IF NOT EXISTS clause directly
//SERIAL UNIQUE -> data type that allowe automatically generate unique intiger numbers

// verificatioEmailToken -> when user create account the token will be stored 
//when user verify their email this field will be set on NULL
//IF we wan't to check is user verified his email we will check does verificatioEmailToken is NULL

 async function connectPool():Promise<void> {
    try{
        await pool.connect();
        await pool.query(authUserTable);
        log.info("Authenticatio Service connected to postgreSQL DB");
    }
    catch(error){
        log.error("Auhtentication Service can't connect to postgreSQL DB");
        log.log("error", "Authentication Service postgreSQL connection failed: ", error);
    }
} 

export {connectPool, pool};