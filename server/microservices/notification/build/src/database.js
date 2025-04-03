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
exports.mongoDBconnection = mongoDBconnection;
const growvia_shared_1 = require("@veckovn/growvia-shared");
const config_1 = require("./config");
const mongoose_1 = __importDefault(require("mongoose"));
const log = (0, growvia_shared_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'NotificationService', 'debug');
function mongoDBconnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(`${config_1.config.DATABASE_URL}`);
            log.info('Notification service connected to mongoDB');
        }
        catch (error) {
            log.log('error', "Notification service mongoDB connection error: ", error);
        }
    });
}
//# sourceMappingURL=database.js.map