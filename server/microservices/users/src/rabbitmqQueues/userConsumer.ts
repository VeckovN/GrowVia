import { CustomerDocumentInterface, winstonLogger} from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { Channel, ConsumeMessage } from 'amqplib';
import { config } from '@users/config';
import { createCustomer } from "@users/services/customer";

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'usersRabbitMQConsumer', 'debug');

// Persistent Queue with "TTL + Requeue"
//Durable and Persistent -> the message is stored in RabbitMQ even if the User Service is down.
//durable and persist is set on publish message -> ack must be sent after processing
const customerDirectConsumer = async (channel:Channel):Promise<void> => {
    ///consume from Authentication (on signup)
    try{
        const exchangeName = 'auth-user-customer';
        const queueName = 'auth-user-customer-queue';
        const routingKey = 'auth-user-customer-key'
  
        //Asserts an exchange into existence (set direct) --- set durable to true(makes queue survive)
        await channel.assertExchange(exchangeName, 'direct', {durable:true});
    
        const authUserQueue = channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-message-ttl": 60000, // Messages expire after 60 seconds if not consumed
                "x-dead-letter-exchange": exchangeName, // Requeue messages instead of DLQ
                "x-dead-letter-routing-key": routingKey, // Send back to same queue
            }
        
        });
        await channel.bindQueue((await authUserQueue).queue, exchangeName,  routingKey);        
        
        channel.consume((await authUserQueue).queue, async (msg: ConsumeMessage | null)=>{
            if(!msg) return;
            try{
                //msg! garante that msg is not null or undefined
                const {type, data} = JSON.parse(msg!.content.toString());
                
                if(type == 'authCreate'){
                    
                    log.info("User Service Data recieved from authentcication");
                    console.log("\n Create Auth Data: ", data);

                    if(data.userType == 'customer'){
                        console.log("Create customer user BEFORE");
                        await createCustomer(data as CustomerDocumentInterface); //from Service
                        console.log("Create customer user AFTER");
                    }
                    else if(data.userType == 'farmer'){
                        //await createFarmer(data);
                    }
                }

                channel.ack(msg!); //Ack after successful processing 
            }
            catch(error){
                log.log("error", "User Service error processing message:", error);
                channel.nack(msg, false, true) //Requeue message instead of moving to DLQ
            }   
        });
        log.info(`Users service customer consumer initialized`);
    }
    catch(error){
        //log? due to test fixing undefied log
        log?.log('error', "Users service customerDirectConsumer failed: ", error);
    }
}

// const farmerDirectConsumer = async (channel:Channel):Promise<void> =>{
//     //consume from Authentication -> on signup(create farmer with additional info 
//     //consume from Order -> on create order, accept order, cancel order (when customer do)
// }
export {
    customerDirectConsumer
    // farmerDirectConsumer
}