import { AuthUserInterface } from "@veckovn/growvia-shared";
import { Request, Response } from "express";
import { create, login, userByEmail, userByID} from "@authentication/controllers/auth";
import { createUser, getUserByEmail, getUserByID, getUserByUsername } from "@authentication/services/auth";
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

export const mockNewUser: AuthUserInterface = {
    id: 4,
    username: 'newUsername',
    // password?: 'tokenVPassword';
    email: "newemail@gmail.com",
    verificationEmailToken:  '299bcc43b6f8c8e720ff482744e0adcceccb7cac7a7a543e7b6101fbd688d13a',
}

export const mockAuthUser: AuthUserInterface = {
    id: 1,
    username: 'authUsername', 
    // password: 'hashedPassword', //some getUser function doesn't return password
    email: "useremail@gmail.com",
    profilePicture: "not yet uploaded to cloudinary",
}


//mock from authentication /service ,jsontoken
//without using spyOn
jest.mock('@authentication/services/auth');
jest.mock("@authentication/rabbitmqQueues/producer");
jest.mock("jsonwebtoken"); //for sign method
jest.mock('bcryptjs');


//req = mockRequest
type reqTypes = string | number | Date | undefined;
//record key = string, record value can be string or number or Date or undefined
const mockRequest = (body: Record<string, reqTypes>) => ({ body } as Request);
const mockResponse = () =>{
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis(),
    res.json = jest.fn();
    return res;
}

describe('create user, signup', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        //data from the client request (body)
        // req = {
        //     body: {
        //         username: mockNewUser.username,
        //         email: mockNewUser.email,
        //         password: mockNewUser.password
        //     },
        // } as Request;
        req = mockRequest({
            username: mockNewUser.username,
            email: mockNewUser.email,
            password: mockNewUser.password
        });
        // res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn()
        // } as unknown as Response
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should create a new user /register and return user token and user data', async () =>{
        
        //methods from modules
        // (getUserByUsername as jest.Mock).mockResolvedValue(null); //user doesn't exist, not registered
        (getUserByUsername as jest.Mock).mockResolvedValue(null); //user doesn't exist, not registered
        (createUser as jest.Mock).mockResolvedValue(4); //new user created id : 4 
        (sign as jest.Mock).mockReturnValue("mockToken");
        (publishMessage as jest.Mock).mockResolvedValue(true);

        await create(req,res);

        // const userExists = await getUserByUsername(username);
        expect(getUserByUsername).toHaveBeenCalledWith("newUsername");
        expect(createUser).toHaveBeenCalled(); //this return new user id :4 but don't have to be taken into account
        expect(sign).toHaveBeenCalledWith(
        {
            userID: 4, //new user id (in auth.ts the createUSer return new user iD)
            email: mockNewUser.email,
            username: mockNewUser.username
        },
            expect.any(String) //Token key for signing
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"User successfully created",
            userID: 4,
            token: "mockToken", //sign "mockToken"
        });
    })

    it('should thrown an error if user already exists', async() =>{
        (getUserByUsername as jest.Mock).mockResolvedValue(mockAuthUser);
        await expect(create(req,res)).rejects.toThrow('User exist, cant be created again');
    })
})


describe('login', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            // usernameOrEmail: 'useremail@gmail.com', 
            usernameOrEmail: mockAuthUser.email, 
            password: 'password'
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })


    it('should login user and return a user token and user data', async() =>{
        //
        (getUserByEmail as jest.Mock).mockResolvedValue(mockAuthUser);
        (compare as jest.Mock).mockResolvedValue(true);
        (sign as jest.Mock).mockReturnValue('mockToken');

        await login(req,res);

        // expect(getUserByEmail).toHaveBeenCalledWith("useremail@gmail.com");
        expect(getUserByEmail).toHaveBeenCalledWith(mockAuthUser.email);
        //getUserBYEmail returns password as property -> mockAuthUser.password actually exists
        expect(compare).toHaveBeenCalledWith("password", mockAuthUser.password);
        expect(sign).toHaveBeenCalledWith(
            {id: 1, email: "useremail@gmail.com", username: "authUsername"},
            expect.any(String) //for token
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User succesfully logged in",
            token:"mockToken",
            user: mockAuthUser
        });
    });

    it('should thrown an error if the user not found', async() => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        await expect(login(req,res)).rejects.toThrow("User not found.");

    });

    it('should thrown an error if password is invalid', async() => {
        //this getUserByEmail with mockAuthUser must be mock due to afterEach(() =>{jest.restoreAllMocks()} 
        //removes pervious mocked data and the found user must be again reaturned to compare their password
        (getUserByEmail as jest.Mock).mockResolvedValue(mockAuthUser);
        (compare as jest.Mock).mockResolvedValue(false); //passwords not mathed

        await expect(login(req,res)).rejects.toThrow("Invalid creadentials. Please try again!");
    });
})

describe('getUserData by email ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            email: 'useremail@gmail.com'
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user date feched by email address ', async () =>{
        (getUserByEmail as jest.Mock).mockResolvedValue(mockAuthUser);
        await userByEmail(req,res);
        expect(getUserByEmail).toHaveBeenCalledWith(mockAuthUser.email);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User created successfully",
            user: mockAuthUser
        });
    })

    it(`should throw an error if user doesn't exist`, async () =>{
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        await expect(userByEmail(req,res)).rejects.toThrow(`The user doesn't exist`); 
    })

})

describe('getUserData by ID ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            userID: 1,
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user date feched by id ', async () =>{
        (getUserByID as jest.Mock).mockResolvedValue(mockAuthUser);
        await userByID(req,res);
        expect(getUserByID).toHaveBeenCalledWith({userID: 1});
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User data get by ID",
            user: mockAuthUser
        });
    })
    it(`should throw an error if user doesn't exist`, async () =>{
        (getUserByID as jest.Mock).mockResolvedValue(null);
        await expect(userByID(req,res)).rejects.toThrow(`The user doesn't exist`); 
    })

})
