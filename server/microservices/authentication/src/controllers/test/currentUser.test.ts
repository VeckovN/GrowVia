//Mocks
//We mock(simulate) because we don't want to sent real Http Request
//Unit Test: Calls the handler and checks if the correct status & response are returned 

//mock the http request and response (setting own mockup function ->)
//There's probably some library for mocking the express Request and Response

//aslo mock some date to send and recieve

import { Request, Response } from 'express';
import { AuthPayloadInterface, AuthUserInterface } from '@veckovn/growvia-shared';
import { getCurrentUser, resendVerificationEmail } from '@authentication/controllers/currentUser';
// import { getUserByID } from '@authentication/services/auth';
import * as authService from "@authentication/services/auth";
// import { publishMessage } from '@authentication/rabbitmqQueues/producer';
import crypto from 'crypto';
//getCurrentUser


//Mock user data that getUserByID function returns
export const mockAuthUser: AuthUserInterface = {
    id: 1,
    username: 'novak12',
    // password?: 'tokenVPassword';
    email: "novak12@gmail.com",
    cloudinaryProfilePublicId: "12312312CLPID",
    profilePicture: "not yet uploaded to cloudinary",
    verificationEmailToken:  "299bcc43b6f8c8e720ff482744e0adcceccb7cac7a7a543e7b6101fbd688d13a",
    resetPasswordToken: null,
    // expiresResetPassword: new Date("2025-02-30 17:31:08.381")
}

//Mock the entire module 
jest.mock('@authentication/services/auth');
jest.mock("@authentication/rabbitmqQueues/producer");
jest.mock("crypto");

//if we want to mock a single fucntion use spyON
//jest.spyOn(require/import , funcName);
//for example getUserByID auth Service function
//jest.spyOn(require('@authentication/services/auth'), 'getUserByID')



//With jest.spyOn
describe("GetCurrentUser", () =>{
    let req:Request;
    let res:Response;

    beforeEach(()=>{
        //put currentUSer to the request (as logged user)
        req = {
            currentUser: {
                id: 1,
                username:"novak12",
                email:"novak12@gmail.com"
            }
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response

        //jest.mock("@authentication/service/auth") without jest.spyOn
         
    })

    afterEach(() => {
        // Restore all mocks after each test
        jest.restoreAllMocks();
      });

    it("should return current user", async() =>{
        //Mock user data that getUserByID function returns
        // const getUserByIDSpy = jest.spyOn(require('@authentication/services/auth'), 'getUserByID')
        // .mockResolvedValue(mockAuthUser);


        //WITH MOCK ENTIRE MODULE -> jest.mock("@authentication/service/auth")
        // //jest.mock("@authentication/service/auth") without jest.spyOn
        // // Directly mock getUserByID since the module is already mocked
        // (getUserByID as jest.Mock).mockResolvedValue(mockAuthUser);


        //IN THIS FILE WE MOCK MORE FUNCTIONS FROM AUTH SERVICE SO THE spyOn SHOULD BE REPLACED WITH mock.jest(@authentication/service/auth)
        //with jest.spyOn mock a single functuion () import * as authService from "@authentication/services/auth";
        //getUserByID from serivice, beacuse this 'getCurrentUser' controlelr func depends on it
        jest.spyOn(authService, 'getUserByID').mockResolvedValue(mockAuthUser);
    

        // Act: Call the function under test
        await getCurrentUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Authenticated user data:",
            user: mockAuthUser
        })

        // Clean up: Restore the original implementation (optional, as Jest automatically restores after each test)
        // getUserByIDSpy.mockRestore();
    })

    it("should return empty user data", async () =>{
        jest.spyOn(authService, 'getUserByID').mockResolvedValue({});
        
        await getCurrentUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Authenticated user data:",
            user: {}
        })
    })
})


//resend email (using only jest.spy)
describe('resendVerificationEmail method', () => {
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        //when the user is logged in (that means the currentUser must be in the request)
        req = {
            currentUser: {
                id: 1,
                username:"novak12",
                email:"novak12@gmail.com"
            } as AuthPayloadInterface
        } as Request

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response
    })


    afterEach(() => {
        jest.restoreAllMocks();
      });

    //without mocking token with 'crypto' -> caused problems
    it("should resend verification email", async () =>{

        //mocking updateEmailVerification, publisMessage and getUserByID
        jest.spyOn(authService, 'updateEmailVerification').mockResolvedValue(true);//1 as true
        const publishMessageSpy = jest.spyOn(require("@authentication/rabbitmqQueues/producer"), "publishMessage").mockResolvedValue(true);//1 as true
        jest.spyOn(authService, 'getUserByID').mockResolvedValue(mockAuthUser);//1 as true
        
        await resendVerificationEmail(req, res);

        // Assert (verify the behaviour)
        //user id = 1, and randomBytes generated token ("mockToken") -> updateEmailVerification(1 , mockToken); , and token
        expect(authService.updateEmailVerification).toHaveBeenCalled();        
        //or use spy defined variable with mocked updateEmailVerification
        // const updateEmailVerificationSpy = jest.spyOn(authService, 'updateEmailVerification').mockResolvedValue(true);
        /// expect(updateEmailVerificationSpy).toHaveBeenCalled();
        expect(publishMessageSpy).toHaveBeenCalled();
        expect(authService.getUserByID).toHaveBeenCalledWith(1); //userID = 1
            
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message:"The verification email has been sent successfully", user:mockAuthUser});
    })
})
