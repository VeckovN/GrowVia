"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmailConsumer = AuthEmailConsumer;
exports.OrderEmailConsumer = OrderEmailConsumer;
exports.PaymentEmailConsumer = PaymentEmailConsumer;
const growvia_shared_1 = require("@veckovn/growvia-shared");
const emailTransport_1 = require("../rabbitmqQueues/emailTransport");
const config_1 = require("../config");
const log = (0, growvia_shared_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'notificationRabbitMQConnection', 'debug');
function AuthEmailConsumer(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exchangeName = 'auth-email-notification';
            const queueName = 'auth-email-queue';
            const routingKey = 'auth-email-key';
            //Asserts an exchange into existence (set direct)
            yield channel.assertExchange(exchangeName, 'direct');
            const authEmailQueue = channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue((yield authEmailQueue).queue, exchangeName, routingKey);
            channel.consume((yield authEmailQueue).queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                //msg! garante that msg is not null or undefined
                const { template, receiverEmail, username, verifyLink, resetLink } = JSON.parse(msg.content.toString());
                const locals = {
                    // appLink: `${config.CLIENT_URL}`, //app link is client URL (app link)
                    username,
                    verifyLink,
                    resetLink
                };
                //different auth emails-templates (forgotPassword, resetPassword verifyEmail, verifyEmailConfirm, ) 
                yield (0, emailTransport_1.sendEmail)(template, receiverEmail, locals);
                channel.ack(msg);
            }));
            log.info(`Notification service emailConsumer initialized`);
        }
        catch (error) {
            //log? due to test fixing undefied log
            log === null || log === void 0 ? void 0 : log.log('error', "Notification service AuthEmailConsumer failed: ", error);
        }
    });
}
function OrderEmailConsumer(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exchangeName = 'order-email-notification';
            const queueName = 'order-email-queue';
            const routingKey = 'order-email-key';
            yield channel.assertExchange(exchangeName, 'direct');
            const orderEmailQueue = channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue((yield orderEmailQueue).queue, exchangeName, routingKey);
            channel.consume((yield orderEmailQueue).queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log(JSON.parse(msg.content.toString()));
                //send emails
                channel.ack(msg);
            }));
            log.info(`Notification service orderConsumer initialized`);
        }
        catch (error) {
            log.log('error', "Notification service OrderEmailConsumer failed: ", error);
        }
    });
}
function PaymentEmailConsumer(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exchangeName = 'payment-email-notification';
            const queueName = 'payment-email-queue';
            const routingKey = 'payment-email-key';
            yield channel.assertExchange(exchangeName, 'direct');
            const paymentEmailQueue = channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue((yield paymentEmailQueue).queue, exchangeName, routingKey);
            channel.consume((yield paymentEmailQueue).queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log(JSON.parse(msg.content.toString()));
                //send emails
                channel.ack(msg);
            }));
            log.info(`Notification service paymentConsumer initialized`);
        }
        catch (error) {
            log.log('error', "Notification service PaymentEmailConsumer failed: ", error);
        }
    });
}
//# sourceMappingURL=emailConsumer.js.map