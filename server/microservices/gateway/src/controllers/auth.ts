//AFTER SENDING REQUEST TO AUTH SERVICE FROM API_GATEWAY

import { Request, Response } from "express";
import { SignUp, SignIn, verifyEmail, forgotPassword, resetPassword} from "@gateway/services/auth.service";
import { AxiosResponse } from "axios";

// ApiGateway request for Signup (to Authentication Service)
//Response is returnd to the Client (with req.session.jwtToken -> Logged user ass well after singup)

//this res.body COMES FROM FRONTEND
export async function register(req:Request, res:Response):Promise<void>{
    //use method from auth.service.ts
    const response: AxiosResponse = await SignUp(req.body);
    //set token to the token session -> session.jwtToken from SingUp response 
    req.session = { jwtToken: response.data.token };
    res.status(200).json({ message:response.data.message, userID:response.data.userID});

    //From "Authentication Service" -> repons of the this SingUp function  (/singup)
    //Should Returns ({user, token:userToken}) 
}

export async function login(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await SignIn(req.body); 
    req.session = { jwtToken: response.data.token };
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function userEmailVerification(req:Request, res:Response):Promise<void>{
    const { userID } = req.body;
    const response: AxiosResponse = await verifyEmail(userID);
    res.status(200).json({message:response.data.message, user:response.data.user});
}


export async function userForgotPassword(req:Request, res:Response):Promise<void>{
    const { email } = req.body;
    const response: AxiosResponse = await forgotPassword(email);
    res.status(200).json({message:response.data.messag});
}

export async function resetUserPassword(req:Request, res:Response):Promise<void>{
    const { password, repeatedPassword } = req.body;
    const token = req.params.token; //from the url /:token
    const response: AxiosResponse = await resetPassword(password, repeatedPassword, token);
    res.status(200).json({message:response.data.message});
}

