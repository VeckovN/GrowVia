import { Logger } from "winston";
import { winstonLogger, EmailLocalsInterface} from "@veckovn/growvia-shared";
import { sendEmailTemplates } from "@notification/emailTemplates";
 
const log:Logger = winstonLogger('http://localhost:9200', 'emailTransport', 'debug');

async function sendEmail(templateName:string, to:string, locals:EmailLocalsInterface):Promise<void> {
    try{
        sendEmailTemplates(templateName, to, locals);
        log.info("Email sent successfully!");
    }
    catch(error){
        log.log("error", "Notifications service Email Transport failed: ", error);
    }
}

export {sendEmail}