
import dotenv from 'dotenv';
dotenv.config();

interface Config {
    NODE_ENV: string | undefined;
    API_GATEWAY_URL: string | undefined;
    ELASTICSEARCH_URL: string | undefined;
    ELASTIC_APM_SERVER_URL: string | undefined;
    ELASTIC_APM_SECRET_TOKEN: string | undefined;
    DATABASE_URL: string | undefined;
    RABBITMQ_AMQP_ENDPOINT: string | undefined;
    REDIS_HOST: string | undefined;
    CLOUDINARY_NAME: string | undefined;
    CLOUDINARY_API_KEY: string | undefined;
    CLOUDINARY_API_SECRET: string | undefined;
    GATEWAY_JWT_TOKEN: string | undefined;
    JWT_TOKEN: string | undefined;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || '',
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '', 
    ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL || '',
    ELASTIC_APM_SECRET_TOKEN: process.env.ELASTIC_APM_SECRET_TOKEN || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    RABBITMQ_AMQP_ENDPOINT: process.env.RABBITMQ_AMQP_ENDPOINT || '',
    REDIS_HOST: process.env.REDIS_HOST || '',
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    GATEWAY_JWT_TOKEN: process.env.GATEWAY_JWT_TOKEN || '123123',
    JWT_TOKEN: process.env.JWT_TOKEN || '123123',
};
