//Different controller and routs for current user 
//it will be in protected route (to get this data user MUST BE LOGGED IN)
import { Request, Response } from "express";
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";
import { AuthEmailVerificationInterface, EmailLocalsInterface } from "@veckovn/growvia-shared";
import { getUserByID, updateEmailVerification, updatePassword } from "@authentication/services/auth";
import { config } from '@authentication/config';
import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';
import { sign } from 'jsonwebtoken';

//difference between these and other controllers is the any user(not logged) can request 
//for signup,signin, forgotPassword or resetPassword .etc, but not for getting (currentUser-> logged) data 

//that means if the token is INVALID the error will be returned, otherwise return actual user data

//More clearly about it will be the use case In React app (Used to check is user still authenticated -.etc on his new request)

// in Gateway/routes.ts the verifyUser and in Gateway/routes/currentUser.ts the ChechAuthUser middleware is used
//that made the protected route (only for logged/authenticated users)

//if the token is valid that means the currentUser is part of the request (req.currentUser)
//because it's checked in middleware on every incoming request from the client(ApiGateway) 

export async function getCurrentUser(req:Request, res:Response):Promise<void> {
    const userID = req.currentUser?.id;
    const user = userID ? await getUserByID(userID) : undefined;
    console.log("current User: ", user)
    res.status(200).json({message:"Authenticated user data:", user});
}   

//if the (new registered) user hasn't verified their email yet, on the next loggin the email will be resend
export async function resendVerificationEmail(req:Request, res:Response):Promise<void>{
    //the user id can be get from the req.currentUser
    const { id, email } = req.currentUser!; //it's ok to use ! because the req.currentUser surely exist (passed the middleware)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `${config.CLIENT_URL}/confirm-email?token=${verificationToken}`
    await updateEmailVerification(id, verificationToken);

    const messageVerificationEmail: AuthEmailVerificationInterface = {
        receiverEmail: email,
        verifyLink: verificationLink,
        template: 'verifyEmail'
    }

    //Now publish message to Notification Service (Produce message on signup action for verify Email)
    await publishMessage(
        authChannel,
        'auth-email-notification',
        'auth-email-key',
        'Verification email has been resent to the Notification Service',
        JSON.stringify(messageVerificationEmail)
    );

    const updatedUser = await getUserByID(id)
    res.status(200).json({message:"The verification email has been sent successfully", user:updatedUser})
}

//user must be logged in (currentUser is passed in requset)
export async function changePassword(req:Request, res:Response):Promise<void>{
    const { currentPassword, newPassword } = req.body;
    const userID = req.currentUser?.id;
    
    if (userID === undefined)
        throw new Error("User id is missing!");
    
    const user = await getUserByID(userID, true);
    if(!user)
        throw new Error("User not found. Not authenticated")
    
    console.log("userPAssword: ", user.password);

    const isMatch = await compare(currentPassword, user.password!);
    if(!isMatch)
        throw new Error("Current password is incorrect.");
    
    const SALT_ROUND = 10;
    const hashedPassoword = await hash(newPassword as string, SALT_ROUND);

    await updatePassword(userID, hashedPassoword);

    const messageUpdatePasswordSuccessEmail: EmailLocalsInterface = {
        receiverEmail: user.email,
        username: user.username,
        template: 'resetPasswordSuccess' //same email tamplate as confirm forgotten password 
    }

    //Now publish message to Notification Service (Produce message on signup action for verify Email)
    await publishMessage(
        authChannel,
        'auth-email-notification',
        'auth-email-key',
        'Update password success email sent to the Notification Service',
        JSON.stringify(messageUpdatePasswordSuccessEmail)
    );

    res.status(200).json({message:"Password successfully updated"});
}

//used to check looged user (by given ID/username ) and resign the token 
// and return it as loggin controller does
export async function refreshToken(req:Request, res:Response):Promise<void> {
    const {id, email, username} = req.currentUser!;
    const user = await getUserByID(id)
    const newUserJwtToken = sign({id, email, username}, `${config.JWT_TOKEN}`);
    res.status(200).json({message:"Refresh token:", token:newUserJwtToken, user});
}   
