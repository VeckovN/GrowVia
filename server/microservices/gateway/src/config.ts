import dotenv from 'dotenv';
dotenv.config();

interface Config {
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    ELASTICSEARCH_URL: string | undefined;
    ELASTIC_APM_SERVER_URL: string | undefined;
    ELASTIC_APM_SECRET_TOKEN: string | undefined;
    REDIS_HOST: string | undefined;
    GATEWAY_JWT_TOKEN: string | undefined;
    JWT_TOKEN: string | undefined;
    FIRST_SECRET_KEY: string | undefined;
    SECOND_SECRET_KEY: string | undefined;
    NOTIFICATION_SERVICE_URL: string | undefined;
    AUTH_SERVICE_URL: string | undefined;
    USER_SERVICE_URL: string | undefined;
    PRODUCT_SERVICE_URL: string | undefined;
    ORDER_SERVICE_URL: string | undefined;
    PAYMENT_SERVICE_URL: string | undefined;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || '',
    CLIENT_URL: process.env.CLIENT_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '', 
    ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL || '',
    ELASTIC_APM_SECRET_TOKEN: process.env.ELASTIC_APM_SECRET_TOKEN || '',
    REDIS_HOST: process.env.REDIS_HOST || '',
    GATEWAY_JWT_TOKEN: process.env.GATEWAY_JWT_TOKEN || '123123',
    JWT_TOKEN: process.env.JWT_TOKEN || '123123',
    FIRST_SECRET_KEY: process.env.FIRST_SECRET_KEY || '',
    SECOND_SECRET_KEY: process.env.SECOND_SECRET_KEY || '',
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || '',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || '',
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || '',
    PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || '',
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || '',
    PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || ''
};
