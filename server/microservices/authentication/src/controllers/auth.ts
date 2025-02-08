import { Request, Response } from 'express';
import { AuthUserInterface, AuthEmailVerificationInterface, EmailLocalsInterface, isEmailValid, ConflictError, BadRequestError, CustomerDocumentInterface, FarmerDocumentInterface} from '@veckovn/growvia-shared';
import { createUser, getUserByID, getUserByEmail, getUserByUsername, getUserByPasswordToken, updateEmailVerification, updatePasswordTokenExpiration, updatePassword} from '@authentication/services/auth';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { config } from '@authentication/config';
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

//factory function (generate user-specific data based on the type)
const factoryCreateUserData = (
    username: string,
    email: string,
    userType: string,
    uploadedPictureResult: string,
    otherUserData: any
): CustomerDocumentInterface | FarmerDocumentInterface =>{

    const baseUserData = { 
        username,
        email,
        profilePicture: uploadedPictureResult
    }

    const userTypeNormalized:string = userType.trim().toLowerCase();
    
    if(userTypeNormalized == 'farmer'){
        return {
            // userType,
            userType: 'farmer', //same
            ...baseUserData,
            ...otherUserData
        } as FarmerDocumentInterface
    }
    else if(userTypeNormalized == 'customer'){
        return {
            userType: 'customer',
            ...baseUserData,
            ...otherUserData
        } as CustomerDocumentInterface
    }
    else {
        throw BadRequestError("Invalid user type.", "Factory create user function error");
    }

}

export async function create(req:Request, res:Response):Promise<void>{
    //otherUserData -> data depends on userType, 
    //username, email and password are base type(Same for both users type)
    const {username, email, password, userType, ...othersUsersData} = req.body;

    const userExists = await getUserByUsername(username);
    if(userExists){
        throw ConflictError("User exist, cant be created again", "create/signup function error");
    }

    //when we on oue own generate publicID for cloudinary when ever the image is updated the  publicID won't be changed 
    //but if we let to cloudinary generate it , it will change publicID on every user image changing
    const profilePublicId = uuidv4();
    //UPLOAD 'profilePicture' ON CLODINARY with this profilePublicId
    // const upldatedPicture =  upload(...)
    const uploadedPictureResult:string =  'not yet uploaded to cloudinary'

    //create Publish Message for email-verification
    //Create random values as our Verification Link
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${verificationToken}`
    // const createUserData: AuthUserInterface = {
    const userAuthData: AuthUserInterface = {
        username: username,
        password: password,
        email: email,
        userType: userType,
        cloudinaryProfilePublicId: profilePublicId,
        profilePicture: uploadedPictureResult,
        verificationEmailToken: verificationToken,
        // resetPasswordToken,
        // expiresResetPassword
    }
    
    //add profilePicture: uploadedPictureResult -> from cloudinary uploading

    //!watch on parameter order
    const userTypeData = factoryCreateUserData(username, email, userType, uploadedPictureResult, othersUsersData);

    const userID: number = await createUser(userAuthData, userTypeData);
    // const user:AuthUserInterface = await createUser(req.body);

    //publishMessage
    //send verificationLink with email to the user (with Notification email feature) -> MessageQueue
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
        'Verification email has been sent to the Notification Service',
        JSON.stringify(messageVerificationEmail)
    );

    //AFTHER THE USER IS CREATEAD HE IS AUTOMATICALLY LOGGED IN (send back creadentials through the token)
    const userToken = sign({userID, email, username}, `${config.JWT_TOKEN}`);

    //sing in token and return as part of res.json
    //This will be sent to APIGateway (that will resend it to client)
    res.status(200).json({message: 'User successfully created', userID, token:userToken});
}

export async function login(req:Request, res:Response):Promise<void>{
    const {usernameOrEmail, password} = req.body;     

    //first check does email passed as argument (because can be both "email or username")
    const validEmail = isEmailValid(usernameOrEmail);
    let user:AuthUserInterface | undefined;

    if(validEmail)
        user = await getUserByEmail(usernameOrEmail);
    else
        user = await getUserByUsername(usernameOrEmail);
    
    console.log("User data on login: ", user);        
    if(!user){
        throw BadRequestError("User not found.", "Login function error");
    }

    //get password from found user
    const isPasswordValid = await compare(password, user.password!); 

    if(!isPasswordValid)
        throw BadRequestError("Invalid creadentials. Please try again!", "Login function error");

    //Send message to Notification Service (for OTP Validation) -> Lattely 
    const userToken = sign({id: user.id, email: user.email, username: user.username}, `${config.JWT_TOKEN}`);
    const {password: userPassword, ...userData} = user;
    //signUp token taht will be send throuhg request and user as cookieSession token
    res.status(200).json({message:"User succesfully logged in", token:userToken, user:userData});
}

export async function verifyEmail(req:Request, res:Response):Promise<void>{
    const {userID} = req.body;
    const authUser = await getUserByID(userID);
    if(!authUser)
        throw BadRequestError("User invalid, you can't verify email", "verifyEmail function error");
    
    console.log("authUser: ", authUser);
    if(!authUser.verificationEmailToken)
        throw BadRequestError("User is already verified!", "verifyEmail function error");
    
    
    await updateEmailVerification(userID, null);
    const updatedUser:AuthUserInterface = await getUserByID(userID) as AuthUserInterface;
    console.log("User after email verification: ", updatedUser);  
    res.status(200).json({message:"User has successfully verified the email", user:updatedUser})
    //or just return message (and change verification status on the frontend)
    // res.status(200).json({message:"User has successfully verified the email"})
}

//send the email for restarting password 
export async function forgotPassword(req:Request, res:Response):Promise<void>{
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if(!user) 
        throw BadRequestError("Invalid credentials, User doesn't exist", "forgotPassword function error"); 
    
    //generate token for resetLink
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLinkWithToken = `${config.CLIENT_URL}/reset_password?token=${resetToken}`;
    //date for expirespasswordLink
    const date:Date = new Date();
    date.setHours(date.getHours() + 1); //get 1 hour as expires time 
    await updatePasswordTokenExpiration(user.id!, resetToken, date);
    // const isUpdated = await updatePasswordTokenExpiration(user.id!, resetToken, date);
    // if(!isUpdated)
    //     throw new Error("Went wrong with updating password token expiration ");
    
    const messageForgotPasswordEmail: EmailLocalsInterface = {
        receiverEmail: email,
        username: user.username,
        resetLink: resetLinkWithToken,
        template: 'forgotPassword'
    }

    await publishMessage(
        authChannel,
        'auth-email-notification',
        'auth-email-key',
        'Frogot password email has been sent to the Notification Service',
        JSON.stringify(messageForgotPasswordEmail)
    );

    res.status(200).json({message:"Forgot message successfully sent"});
}

export async function resetPassword(req:Request, res:Response):Promise<void>{
    //on forgotPassword email the user passing new password (as password and repeatedPassword -> both must match)
    const { password, repeatedPassword } = req.body;
    // //token from URL: config.CLIENT_URL}/reset_password?token=${resetToken}
    const token = req.params.token;

    if(password !== repeatedPassword)
        throw BadRequestError("Password don't match", "resetPassword function error");

    //When the token expired it becomes null 
    const user = await getUserByPasswordToken(token);
    if(!user) //that means token has expired
        throw BadRequestError("Reset Token has expired", "resetPassword function error");

    const SALT_ROUND = 10;
    const hashedPassoword = await hash(password as string, SALT_ROUND);
    await updatePassword(user.id!, hashedPassoword);

    //message
    const messageResetPasswordSuccessEmail: EmailLocalsInterface = {
        receiverEmail: user.email,
        username: user.username,
        template: 'resetPasswordSucceed'
    }

    //Now publish message to Notification Service (Produce message on signup action for verify Email)
    await publishMessage(
        authChannel,
        'auth-email-notification',
        'auth-email-key',
        'Reset password success email sent to the Notification Service',
        JSON.stringify(messageResetPasswordSuccessEmail)
    );

    res.status(200).json({message:"Password successfully sent"});
}   

export async function userByID(req:Request, res:Response):Promise<void>{
    const user: AuthUserInterface | undefined = await getUserByID(req.body);
    if(!user){ //undefined
        //This  error that will be caught in server.ts express middleware-> as errorHandlerMiddleware()
        //THE errorHandlerMiddleware RETURN RESPONSIVE(Bad Request or what we pass in ERROR) TO THE API GATEWAY -> API_GATEWAY WILL PASS IT TO THE CLIENT
        throw BadRequestError("The user doesn't exist", "userByID function error"); //this will be displayed on fronted(passed thgouthg apiGateway)
    }   
    res.status(200).json({message: 'User data get by ID', user});
}

export async function userByEmail(req:Request, res:Response):Promise<void>{
    const user:AuthUserInterface | undefined = await getUserByEmail(req.body);
    if(!user)
        throw BadRequestError("The user doesn't exist", "userByEmail function error");
    
    res.status(200).json({message: 'User created successfully', user});
}

export async function userByUsername(req:Request, res:Response):Promise<void>{
    const user: AuthUserInterface | undefined = await getUserByUsername(req.body);
    if(!user)
        throw BadRequestError("The user doesn't exist", "userByUsername function error");
    
    res.status(200).json({message: 'User created successfully', user});
}

