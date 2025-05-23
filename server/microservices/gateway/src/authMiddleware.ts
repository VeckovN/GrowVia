//we have one token for Client->APiGateway  (JWT_TOKEN)
//and another for ApiGataway->Microservices (GATEWAY_JWT_TOKEN)
import { Request, Response, NextFunction } from "express";
import { AuthPayloadInterface, NotAuthorizedError, BadRequestError } from '@veckovn/growvia-shared';
import { config } from '@gateway/config';
import { verify } from "jsonwebtoken";

//ON every request (that need user to be logged in) it checking does it have jwtToken in session
//and is it valid -> then return req.currentUser as object with user data:AuthPayloadInterface
export function verifyUser(req:Request, _res:Response, next:NextFunction):void {
    console.log("verifyUser - req.session: ", req.session);
    
    if(!req.session?.jwtToken) //if user doesn't have session (not logged)
        throw NotAuthorizedError("Token isnt' avaliable, Login again!", "verifyUser function error");
    
    try{
        //Request must come from the APIGATEWAY(not directly from client allowed) -> verify it with GATEWAY_JWT_TOKEN
        //JWT_TOKEN(the token is sign that comes from client) instead of API_GATEWAY_TOKEN -> 
        const payload: AuthPayloadInterface = verify(req.session?.jwtToken, `${config.JWT_TOKEN}`) as AuthPayloadInterface;
        req.currentUser = payload;  
    }
    catch(error){
        throw NotAuthorizedError("Token isn't valid, Login again!", "verifyUser function error");
    }

    next();
}   

//Authenitcated(Looged) user has currentUser
export function checkUserAuth(req:Request, _res:Response, next:NextFunction):void {
    console.log("checkUserAuth - req.currentUser: ", req.currentUser);
    if(!req.currentUser){
        throw BadRequestError("User isn't authenticated for this route", "checkUserAuth function error")
    }

    next();
}