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
exports.sendEmail = sendEmail;
const growvia_shared_1 = require("@veckovn/growvia-shared");
const emailTemplates_1 = require("../emailTemplates");
const log = (0, growvia_shared_1.winstonLogger)('http://localhost:9200', 'emailTransport', 'debug');
function sendEmail(templateName, to, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, emailTemplates_1.sendEmailTemplates)(templateName, to, locals);
            log.info("Email sent successfully!");
        }
        catch (error) {
            log.log("error", "Notifications service Email Transport failed: ", error);
        }
    });
}
//# sourceMappingURL=emailTransport.js.map