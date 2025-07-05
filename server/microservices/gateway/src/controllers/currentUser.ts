import { Request, Response } from "express";
import { getCurrentUser, resendVerificationEmail, changePassword, refreshToken} from "@gateway/services/auth.service";
import { AxiosResponse } from "axios";
import { getLoggedUsers, removeLoggedUser } from '@gateway/redis';
import { getSocketIO } from '@gateway/sockets';


export async function authUser(_req:Request, res:Response):Promise<void>{
    //data didn't pass, because logged user has data in request (on Auth service)
    const response: AxiosResponse = await getCurrentUser();
    res.status(200).json({message:response.data.message, user:response.data.user});
}

export async function getLoggedUsersList(_req:Request, res:Response):Promise<void>{
    const users: string[] = await getLoggedUsers('loggedUsers');
    const socketIO = getSocketIO();
    socketIO.emit('online', users); //just sent users to 'online' event
    res.status(200).json({ message:"Users are online", users: users});
}

export async function removeLoggedUserFromList(req:Request, res:Response):Promise<void>{
    const users :string[] = await removeLoggedUser('loggedUsers', req.params.username);
    // const socketIO = getSocketIO();
    getSocketIO().emit('online', users);
    res.status(200).json({ message:"User is removed" });
}

//setLoggedUser didn't need becuase the socket event will be trigger on login request from frontend

export async function resendVerification(_req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await resendVerificationEmail();
    res.status(200).json({message:response.data.message, user:response.data.user});
}

export async function changeAuthUserPassword(req:Request, res:Response):Promise<void>{
    //get only new password (for this request user must be logged in -> req.currentUser will be set on Auth Service )
    // const {newPassword} = req.body;
    const {currentPassword, newPassword} = req.body;
    // const response: AxiosResponse = await changePassword(newPassword);
    const response: AxiosResponse = await changePassword(currentPassword, newPassword);
    res.status(200).json({message:response.data.message});
}

export async function refreshUserToken(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await refreshToken();
    req.session = { jwtToken: response.data.token };
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

