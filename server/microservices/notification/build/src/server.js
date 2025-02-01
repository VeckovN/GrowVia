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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const http_1 = __importDefault(require("http"));
const growvia_shared_1 = require("@veckovn/growvia-shared");
const routes_1 = require("./routes");
const elasticsearch_1 = require("./elasticsearch");
const rabbitmq_1 = require("./rabbitmqQueues/rabbitmq");
const emailConsumer_1 = require("./rabbitmqQueues/emailConsumer");
const config_1 = require("./config");
const Server_port = 4001;
const log = (0, growvia_shared_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'notificationService', 'debug');
function start(app) {
    startServer(app);
    (0, elasticsearch_1.checkConnection)();
    //the only route that isn;t passed through API Gataway(used for checking status of this service)
    app.use('', (0, routes_1.healthRoute)());
    //rabbitMQ queue connection
    startQueues();
}
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        //create channel for AuthEmailConsumer, OrderEmailConsumer, PaymentEmailConsumer
        const emailChannel = yield (0, rabbitmq_1.createConnection)();
        yield (0, emailConsumer_1.AuthEmailConsumer)(emailChannel);
        yield (0, emailConsumer_1.OrderEmailConsumer)(emailChannel);
        yield (0, emailConsumer_1.PaymentEmailConsumer)(emailChannel);
        // await publishMessages(emailChannel);
    });
}
function startServer(app) {
    try {
        const server = new http_1.default.Server(app);
        log.info(`Notification service starting, process ID:${process.pid}`);
        server.listen(Server_port, () => {
            log.info(`Notification service is running on port: ${Server_port}`);
        });
    }
    catch (err) {
        log.log('error', 'Notification service running error ', err);
    }
}
// @ts-ignore (avoid unused function errior)
function publishMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        //publish some test messages (ofc to exchanger)
        const authEmailExchangeName = 'auth-email-notification';
        const authEmailRoutingKey = 'auth-email-key';
        yield channel.assertExchange(authEmailExchangeName, 'direct');
        //all props for sending 'verifyEmail' 
        //Token for getting response on email confirm
        const emailAuthMessage = {
            template: 'verifyEmail',
            receiverEmail: `${config_1.config.TEST_EMAIL}`, //sender mail
            resetLink: `${config_1.config.CLIENT_URL}/confirm_email_EXAMPLE_NOT_GENERATED`,
            username: "TestUsername"
        };
        const message = JSON.stringify(emailAuthMessage);
        channel.publish(authEmailExchangeName, authEmailRoutingKey, Buffer.from(message));
        const orderEmailExchangeName = 'order-email-notification';
        const orderEmailRoutingKey = 'order-email-key';
        yield channel.assertExchange(orderEmailExchangeName, 'direct');
        // const emailOrderMessage: EmailLocalsInterface = {
        //     template:'orderProduct',
        //     receiverEmail: `${config.TEST_EMAIL}`,
        // }
        const messageOrder = JSON.stringify({ name: "growvia", service: "notification", context: "Test order message" });
        channel.publish(orderEmailExchangeName, orderEmailRoutingKey, Buffer.from(messageOrder));
        const paymentEmailExchangeName = 'payment-email-notification';
        const paymentEmailRoutingKey = 'payment-email-key';
        yield channel.assertExchange(orderEmailExchangeName, 'direct');
        const messagePayment = JSON.stringify({ name: "growvia", service: "notification", context: "Test payment message" });
        channel.publish(paymentEmailExchangeName, paymentEmailRoutingKey, Buffer.from(messagePayment));
    });
}
//# sourceMappingURL=server.js.map