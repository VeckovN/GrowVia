"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const rabbitmq = __importStar(require("../../rabbitmqQueues/rabbitmq"));
const emailConsumer_1 = require("../../rabbitmqQueues/emailConsumer");
//use jest to MOCK the connection "rabitmq.ts" file (mock all inside the rabbitMQ folder)
jest.mock('@notification/rabbitmqQueues/rabbitmq');
//library must be mocked as well
jest.mock('amqplib');
jest.mock('@veckovn/growvia-shared');
//if we call that function we want to test the properties as 'assertExchange, assertQueue, ...
describe("Email Consumer", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    //use another describe (to call "AuthEmailConsumer")
    describe("AuthEmailConsumer", () => {
        //inside describe with 'it' we can "GROUP BLOCK"
        it("it should be called ", () => __awaiter(void 0, void 0, void 0, function* () {
            //Mock the channel (for mocking connection)
            const channel = {
                //this is all what channel calles (using)
                assertExchange: jest.fn(),
                assertQueue: jest.fn(),
                bindQueue: jest.fn(),
                publish: jest.fn(),
                consume: jest.fn(),
            };
            jest.spyOn(channel, 'assertExchange');
            //assertQueue returns object AssertQueue with queue: string; messageCount: number; consumerCount: number;
            jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
            jest.spyOn(rabbitmq, 'createConnection').mockReturnValue(channel);
            // IT WILL CREATED MOCKED CONNECTION , not real one
            const connectionChannel = yield rabbitmq.createConnection();
            yield (0, emailConsumer_1.AuthEmailConsumer)(connectionChannel);
            //now check ARE 'assertExchange, assertQueue..." methods CALLED?
            expect(connectionChannel.assertExchange).toHaveBeenCalledWith('auth-email-notification', 'direct');
            expect(connectionChannel.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'auth-email-notification', 'auth-email-key');
        }));
    });
});
//# sourceMappingURL=emailConsumer.test.js.map