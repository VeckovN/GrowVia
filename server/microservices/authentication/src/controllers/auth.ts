import { Request, Response } from 'express';
import { AuthUserInterface } from '@veckovn/growvia-shared';
import { createUser, getUserByID, getUserByEmail, getUserByUsername} from '@authentication/services/auth';


export async function create(req:Request, res:Response):Promise<void>{
    const userID: number = await createUser(req.body);
    res.status(200).json({message: 'User created successfully', userID});
}

export async function userByID(req:Request, res:Response):Promise<void>{
    const user: AuthUserInterface | undefined = await getUserByID(req.body);
    if(!user){ //undefined
        //This  error that will be caught in server.ts express middleware-> as errorHandlerMiddleware()
        //THE errorHandlerMiddleware RETURN RESPONSIVE(Bad Request or what we pass in ERROR) TO THE API GATEWAY -> API_GATEWAY WILL PASS IT TO THE CLIENT
        //throw new CustomError("The user doesn't exist", 400);
        throw new Error("The user doesn't exist"); //this will be displayed on fronted(passed thgouthg apiGateway)
    }   

    res.status(200).json({message: 'User data get by ID', user});
}
export async function userByEmail(req:Request, res:Response):Promise<void>{
    const user:AuthUserInterface | undefined = await getUserByEmail(req.body);
    if(!user){
        //throw new CustomError("The user doesn't exist", 400);
        throw new Error("The user doesn't exist");
    }
    res.status(200).json({message: 'User created successfully', user});
}
export async function userByUsername(req:Request, res:Response):Promise<void>{
    const user: AuthUserInterface | undefined = await getUserByUsername(req.body);
    if(!user){
        //throw new CustomError("The user doesn't exist", 400);
        throw new Error("The user doesn't exist");
    }
    res.status(200).json({message: 'User created successfully', user});
}

