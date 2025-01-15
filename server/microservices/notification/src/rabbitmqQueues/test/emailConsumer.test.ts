import * as rabbitmq from "@notification/rabbitmqQueues/rabbitmq";
import { AuthEmailConsumer } from "@notification/rabbitmqQueues/emailConsumer";
import amqp from 'amqplib'; 

//use jest to MOCK the connection "rabitmq.ts" file (mock all inside the rabbitMQ folder)
jest.mock('@notification/rabbitmqQueues/rabbitmq');
//library must be mocked as well
jest.mock('amqplib');
jest.mock('@veckovn/growvia-shared');


//if we call that function we want to test the properties as 'assertExchange, assertQueue, ...
describe("Email Consumer", ()=>{
    beforeEach(() =>{
        jest.resetAllMocks();
    });

    afterEach(() =>{
        jest.clearAllMocks();
    });

    //use another describe (to call "AuthEmailConsumer")
    describe("AuthEmailConsumer", () => {
        //inside describe with 'it' we can "GROUP BLOCK"
        it("it should be called ", async()=> {
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
            jest.spyOn(channel, 'assertQueue').mockReturnValue({queue:'auth-email-queue', messageCount: 0, consumerCount:0});
            jest.spyOn(rabbitmq, 'createConnection').mockReturnValue(channel as never);
            // IT WILL CREATED MOCKED CONNECTION , not real one
            const connectionChannel: amqp.Channel | undefined = await rabbitmq.createConnection();
            await AuthEmailConsumer(connectionChannel!);

            //now check ARE 'assertExchange, assertQueue..." methods CALLED?
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('auth-email-notification', 'direct');
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue','auth-email-notification','auth-email-key');
        });
    });

})