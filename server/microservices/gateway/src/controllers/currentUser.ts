import { Request, Response } from "express";
import { getCurrentUser, resendVerificationEmail, changePassword, refreshToken} from "@gateway/services/auth.service";
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

export async function changeAuthUserPassword(req:Request, res:Response):Promise<void>{
    //get only new password (for this request user must be logged in -> req.currentUser will be set on Auth Service )
    const {newPassword} = req.body;
    const response: AxiosResponse = await changePassword(newPassword);
    res.status(200).json({message:response.data.message});
}

export async function refreshUserToken(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await refreshToken();
    req.session = { jwtToken: response.data.token };
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

