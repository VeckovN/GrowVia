import { Request, Response } from "express";
import { getCurrentUser, resendVerificationEmail } from "@gateway/services/auth.service";
import { AxiosResponse } from "axios";


export async function authUser(_req:Request, res:Response):Promise<void>{
    //data didn't pass, because logged user has data in request (on Auth service)
    const response: AxiosResponse = await getCurrentUser();
    res.status(200).json({message:response.data.message, user:response.data.user});
}

export async function resendVerification(_req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await resendVerificationEmail();
    res.status(200).json({message:response.data.message, user:response.data.user});
}