"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    NODE_ENV: process.env.NODE_ENV || '',
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || '',
    CLIENT_URL: process.env.CLIENT_URL || '',
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || '',
    ELASTICSEARCH_APM_SERVER_URL: process.env.ELASTICSEARCH_APM_SERVER_URL || '',
    ELASTICSEARCH_APM_TOKEN: process.env.ELASTICSEARCH_APM_TOKEN || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    RABBITMQ_AMQP_ENDPOINT: process.env.RABBITMQ_AMQP_ENDPOINT || '',
    TEST_EMAIL_NAME: process.env.TEST_EMAIL_NAME || '',
    TEST_EMAIL: process.env.TEST_EMAIL || '',
    TEST_EMAIL_PASSWORD: process.env.TEST_EMAIL_PASSWORD || '',
    GATEWAY_JWT_TOKEN: process.env.GATEWAY_JWT_TOKEN || '123123',
    JWT_TOKEN: process.env.JWT_TOKEN || '123123'
};
//# sourceMappingURL=config.js.map