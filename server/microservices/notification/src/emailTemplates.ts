import { Logger } from "winston";
import { winstonLogger } from "@veckovn/growvia-shared";
import { config } from '@notification/config';
import { EmailLocalsInterface } from "@veckovn/growvia-shared";
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'emailTransportTemplate', 'debug');

async function sendEmailTemplates(templateName:string, toReceiver:string, locals:EmailLocalsInterface):Promise<void> {
    try{
        const transporter: Transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
              user: config.TEST_EMAIL,
              pass: config.TEST_EMAIL_PASSWORD,
            },
        });

        const email: Email = new Email({
            message: {
                from: `Growvia ${config.TEST_EMAIL}`
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
            juiceResources:{
                preserveImportant:true, //preserve !important in css
                webResources:{
                    relativeTo: path.join(__dirname, '../build') //spacife path for build folder (that is inside of src)
                } 
            }
        })
   
        await email.send({
            //with '..' go to 'src' and then 'src/emails', for example templateName = forgotPassword
            template: path.join(__dirname, "..", 'src/emails', templateName),
            message: {
                to: toReceiver,
            },
            locals: locals // accessible with "<%=locals prop%>" in templates
        })
        
    }
    catch(error){
        log.log("error", "Notification service sendEmailTemplates failure: ", error);
    }
}

export { sendEmailTemplates };

