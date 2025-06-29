import { Request, Response } from 'express';
import { AuthPayloadInterface, AuthUserInterface } from '@veckovn/growvia-shared';
import { getCurrentUser, resendVerificationEmail } from '@authentication/controllers/currentUser';
import * as authService from "@authentication/services/auth";

//Mock user data that getUserByID function returns
export const mockAuthUser: AuthUserInterface = {
    id: '1',
    username: 'novak12',
    email: "novak12@gmail.com",
    cloudinaryProfilePublicId: "12312312CLPID",
    profilePicture: "not yet uploaded to cloudinary",
    verificationEmailToken:  "299bcc43b6f8c8e720ff482744e0adcceccb7cac7a7a543e7b6101fbd688d13a",
    resetPasswordToken: null,
}

//Mock the entire module  (jest.mock)
// jest.mock('@authentication/services/auth');
// jest.mock("@authentication/rabbitmqQueues/producer");

//if we want to mock a single fucntion use spyOn
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
                id: '1',
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
                id: '1',
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

    it("should resend verification email", async () =>{
        jest.spyOn(authService, 'updateEmailVerification').mockResolvedValue(true);//1 as true
        const publishMessageSpy = jest.spyOn(require("@authentication/rabbitmqQueues/producer"), "publishMessage").mockResolvedValue(true);//1 as true
        jest.spyOn(authService, 'getUserByID').mockResolvedValue(mockAuthUser);//1 as true
        
        await resendVerificationEmail(req, res);

        expect(authService.updateEmailVerification).toHaveBeenCalled();        
        expect(publishMessageSpy).toHaveBeenCalled();
        expect(authService.getUserByID).toHaveBeenCalledWith('1'); //userID = 1
            
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message:"The verification email has been sent successfully", user:mockAuthUser});
    })
})
