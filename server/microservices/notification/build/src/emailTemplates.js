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
exports.sendEmailTemplates = sendEmailTemplates;
const growvia_shared_1 = require("@veckovn/growvia-shared");
const config_1 = require("./config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
const log = (0, growvia_shared_1.winstonLogger)('http://localhost:9200', 'emailTransportTemplate', 'debug');
function sendEmailTemplates(templateName, toReceiver, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: config_1.config.TEST_EMAIL,
                    pass: config_1.config.TEST_EMAIL_PASSWORD,
                },
            });
            const email = new email_templates_1.default({
                message: {
                    from: `Growvia ${config_1.config.TEST_EMAIL}`
                },
                send: true,
                preview: false,
                transport: transporter,
                views: {
                    options: {
                        extension: 'ejs'
                    }
                },
                juice: true, //enable using css for email-templates
                //beacuse in templates the inline css is used
                juiceResources: {
                    preserveImportant: true, //preserve !important in css
                    webResources: {
                        relativeTo: path_1.default.join(__dirname, '../build') //spacife path for build folder (that is inside of src)
                    }
                }
            });
            yield email.send({
                //with '..' go to 'src' and then 'src/emails', for example templateName = forgotPassword
                template: path_1.default.join(__dirname, "..", 'src/emails', templateName),
                message: {
                    to: toReceiver,
                },
                locals: locals // accessible with "<%=locals prop%>" in templates
            });
        }
        catch (error) {
            log.log("error", "Notification service sendEmailTemplates failure: ", error);
        }
    });
}
//# sourceMappingURL=emailTemplates.js.map