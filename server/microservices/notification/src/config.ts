import dotenv from 'dotenv';
dotenv.config();

interface Config {
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    ELASTICSEARCH_URL: string | undefined;
    ELASTICSEARCH_APM_SERVER_URL: string | undefined;
    ELASTICSEARCH_APM_TOKEN: string | undefined;
    RABBITMQ_AMQP_ENDPOINT: string | undefined;
    TEST_EMAIL_NAME: string | undefined;
    TEST_EMAIL: string | undefined;
    TEST_EMAIL_PASSWORD: string | undefined;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || '',
    CLIENT_URL: process.env.CLIENT_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '', 
    ELASTICSEARCH_APM_SERVER_URL: process.env.ELASTICSEARCH_APM_SERVER_URL || '',
    ELASTICSEARCH_APM_TOKEN: process.env.ELASTICSEARCH_APM_TOKEN || '',
    RABBITMQ_AMQP_ENDPOINT: process.env.RABBITMQ_AMQP_ENDPOINT || '',
    TEST_EMAIL_NAME: process.env.TEST_EMAIL_NAME || '',
    TEST_EMAIL: process.env.TEST_EMAIL || '',
    TEST_EMAIL_PASSWORD: process.env.TEST_EMAIL_PASSWORD || '',
};
