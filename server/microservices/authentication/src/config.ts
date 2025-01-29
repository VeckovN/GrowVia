
import dotenv from 'dotenv';
dotenv.config();

interface Config {
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    API_GATEWAY_URL: string | undefined;
    ELASTICSEARCH_URL: string | undefined;
    ELASTICSEARCH_APM_SERVER_URL: string | undefined;
    ELASTICSEARCH_APM_TOKEN: string | undefined;
    RABBITMQ_AMQP_ENDPOINT: string | undefined;
    REDIS_HOST: string | undefined;
    POSTGRESQL_HOST: string | undefined;
    POSTGRESQL_USER: string | undefined;
    POSTGRESQL_PASSWORD: string | undefined;
    POSTGRESQL_NAME: string | undefined;
    CLOUDINARY_NAME: string | undefined;
    CLOUDINARY_API_KEY: string | undefined;
    CLOUDINARY_API_SECRET: string | undefined;
    GATEWAY_JWT_TOKEN: string | undefined;
    JWT_TOKEN: string | undefined;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || '',
    CLIENT_URL: process.env.CLIENT_URL || '',
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '', 
    ELASTICSEARCH_APM_SERVER_URL: process.env.ELASTICSEARCH_APM_SERVER_URL || '',
    ELASTICSEARCH_APM_TOKEN: process.env.ELASTICSEARCH_APM_TOKEN || '',
    RABBITMQ_AMQP_ENDPOINT: process.env.RABBITMQ_AMQP_ENDPOINT || '',
    REDIS_HOST: process.env.REDIS_HOST || '',
    POSTGRESQL_HOST: process.env.POSTGRESQL_HOST || '',
    POSTGRESQL_USER: process.env.POSTGRESQL_USER || '',
    POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD || '',
    POSTGRESQL_NAME: process.env.POSTGRESQL_NAME || '',
    CLOUDINARY_NAME: process.env.POSTGRESQL_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    GATEWAY_JWT_TOKEN: process.env.GATEWAY_JWT_TOKEN || '123123',
    JWT_TOKEN: process.env.JWT_TOKEN || '123123',
};
