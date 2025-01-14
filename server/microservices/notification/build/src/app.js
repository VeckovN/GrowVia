"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const growvia_shared_1 = require("@veckovn/growvia-shared");
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const log = (0, growvia_shared_1.winstonLogger)('http://localhost:9200', 'notificationApp', 'debug');
function Init() {
    const app = (0, express_1.default)();
    (0, server_1.start)(app);
    log.info("Notification Service successfully initialized");
}
Init();
//# sourceMappingURL=app.js.map