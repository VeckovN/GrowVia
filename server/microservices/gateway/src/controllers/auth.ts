//AFTER SENDING REQUEST TO AUTH SERVICE FROM API_GATEWAY

import { Request, Response } from "express";
import { SignUp, SignIn, verifyEmail, forgotPassword, resetPassword} from "@gateway/services/auth.service";
import { getCustomerDetailsByUsername, getFarmerDetailsByUsername } from "@gateway/services/user.service";
import { setLoggedUser } from "@gateway/redis";
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
    // FOR TESTING put here  the username to 'loggedUser' 
    await setLoggedUser('loggedUsers', req.body?.usernameOrEmail);
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

//two seperate requests (auth and users service) as single api gateway response
export async function loginSingleRequest(req:Request, res:Response):Promise<void>{
    const authResponse: AxiosResponse = await SignIn(req.body); 
    const { token, user } = authResponse.data;

    // req.session = { jwtToken: authResponse.data.token };
    req.session = { jwtToken: token };
    
    // FOR TESTING put here  the username to 'loggedUser' 
    //make user online
    await setLoggedUser('loggedUsers', req.body?.usernameOrEmail);
    
    
    //Fetch profie from Users service 
    //we can put it in try/catch (tohandle potential UserService request error)
    let userProfile = {};
    try {
        //!!! -> if you make Request with .http file the  prop "userType" is  lowercase ("usertype") -> user.userType won't worl
        console.log("AUth User data: ", user);
        if(user.userType == 'customer' ){
            const customerResponse = await getCustomerDetailsByUsername(user.username)
            const { createdAt, updatedAt, __v, _id, ...cleanedProfile } = customerResponse.data.user
            userProfile = cleanedProfile;
            console.log("Customer user profile data: ", userProfile);
        }
        else if(user.userType == 'farmer'){
            const farmerResponse = await getFarmerDetailsByUsername(user.username)
            const { createdAt, updatedAt, __v, _id, ...cleanedProfile } = farmerResponse.data.user
            userProfile = cleanedProfile;
            console.log("Farmer user profile data: ", userProfile);
        }
    }
    catch(error){
        //userProfile is still {}
        console.log("User service profile request failed", error);
    }

    //Combine response
    const combinedData ={
        //authData
        ...authResponse.data.user,
        ...userProfile
    }
    console.log("comvined Data: ", combinedData);

    // res.status(200).json({message:response.data.message, user:response.data.user});
    res.status(200).json({message:"You're successfully logged in!!!", user:combinedData});
}

//without requesting '/signup' Authentication Service endpoint 
//the current user session with req.session will be reseted 
export async function logout(req:Request, res:Response):Promise<void>{
    req.session = null
    //maybe call function from currentUser to remove user from online list
    res.status(200).json({ message:"Logout successful", user:{} });
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