//we have one token for Client->APiGateway  (JWT_TOKEN)
//and another for ApiGataway->Microservices (GATEWAY_JWT_TOKEN)
import { Request, Response, NextFunction } from "express";
import { AuthPayloadInterface } from '@veckovn/growvia-shared';
import { config } from '@gateway/config';
import { verify } from "jsonwebtoken";

//ON every request (that need user to be logged in) it checking does it have jwtToken in session
//and is it valid -> then return req.currentUser as object with user data:AuthPayloadInterface
export function verifyUser(req:Request, _res:Response, next:NextFunction):void {
    
    if(!req.session?.jwtToken) //if user doesn't have session (not logged)
        throw new Error("Token isnt' avaliable, Login again!"); //use Error hanlder function from shared libraryu

    try{
        //Request must come from the APIGATEWAY(not directly from client allowed) -> verify it with GATEWAY_JWT_TOKEN
        const payload: AuthPayloadInterface = verify(req.session?.jwtToken, `${config.GATEWAY_JWT_TOKEN}`) as AuthPayloadInterface;
        req.currentUser = payload;  
    }
    catch(error){
        throw new Error("Token isn't valid, Login again!");
    }

    next();
}   

//Authenitcated(Looged) user has currentUser
export function checkUserAuth(req:Request, _res:Response, next:NextFunction):void {
    if(!req.currentUser){
        throw new Error("User isn't authenticated for this route");
    }

    next();
}