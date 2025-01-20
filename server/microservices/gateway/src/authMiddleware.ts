//we have one token for Client->APiGateway 
//and another for ApiGataway->Microservices

import { Request, Response, NextFunction } from "express";
import { config } from '@gateway/config';
import { verify } from "jsonwebtoken";

//this chekcking token Between Client and ApiGateway
//Every request that comming from client will be checked here does is token valid

//interface (should be in shared library)
interface AuthPayloadInterface {
    id:number,
    username: string,
    email: string,
    iat?: number,
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthPayloadInterface;
        }
    }
}

export function verifyUser(req:Request, _res:Response, next:NextFunction):void {
    
    if(!req.session?.jwtToken) //if user doesn't have session (not logged)
        throw new Error("Token isnt' avaliable, Login again!"); //use Error hanlder function from shared libraryu

    try{
        const payload: AuthPayloadInterface = verify(req.session?.jwtToken, `${config.GATEWAY_JWT_TOKEN}`) as AuthPayloadInterface;
        req.currentUser = payload;  
    }
    catch(error){
        throw new Error("Token isn't valid, Login again!");
    }

    next();
}   


export function checkUserAuth(req:Request, _res:Response, next:NextFunction):void {
    if(!req.currentUser){
        throw new Error("User isn't authenticated for this route");
    }

    next();
}

