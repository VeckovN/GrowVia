
import dotenv from 'dotenv';
dotenv.config();

if (process.env.ENABLE_APM === '1') {
    require('elastic-apm-node').start({
        serviceName: 'growvia-authentication',
        serverUrl: process.env.ELASTIC_APM_SERVER_URL,
        secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
        environment: process.env.NODE_ENV, 
        active: true,
        captureBody: 'all',
        errorOnAbortedRequests: true,
        captureErrorLogStackTraces: 'always'
    });
}

interface Config {
    NODE_ENV: string | undefined;
    API_GATEWAY_URL: string | undefined;
    ELASTICSEARCH_URL: string | undefined;
    ELASTIC_APM_SERVER_URL: string | undefined;
    ELASTIC_APM_SECRET_TOKEN: string | undefined;
    STRIPE_SECRET_KEY: string | undefined;
    RABBITMQ_AMQP_ENDPOINT: string | undefined;
    GATEWAY_JWT_TOKEN: string | undefined;
    JWT_TOKEN: string | undefined;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || '',
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '', 
    ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL || '',
    ELASTIC_APM_SECRET_TOKEN: process.env.ELASTIC_APM_SECRET_TOKEN || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    RABBITMQ_AMQP_ENDPOINT: process.env.RABBITMQ_AMQP_ENDPOINT || '',
    GATEWAY_JWT_TOKEN: process.env.GATEWAY_JWT_TOKEN || '123123',
    JWT_TOKEN: process.env.JWT_TOKEN || '123123',
};
