import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";

//Each service has own 'Axios Instnace"
//because we need to add JWT token that comming from Clients that is added to the cookie-session
//and append it to the request That is going from the API_Gateway to the Microservice(in this case to the "Auth Service")

//with axios
//requestGatewayToken passed throught header (From This requset From API-Gateway to the AuthService)
const authAxiosInstance = createAxiosInstance(`${config.AUTH_SERVICE_URL}/api/v1/auth`, 'auth');

interface AuthBodyRequestInterface {
    username?: string,
    email?: string,
    password?: string,
    profilePicture?: string
}   

async function SignUp(body: AuthBodyRequestInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.post('/signup', body);
    return res;
}

async function SignIn(body: AuthBodyRequestInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.post('/signin', body);
    return res;
}

async function verifyEmail(userID: string, token:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.put('/verify-email', { userID, token });
    return res;
}

async function changePassword(currentPassword:string, newPassword:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.patch('/change-password', { currentPassword, newPassword });
    return res;
}

async function forgotPassword(email:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.put('/forgot-password', { email });
    return res;
}

async function resetPassword(password:string, repeatedPassword:string, token:string):Promise<AxiosResponse> {
    //token is passed in url -> req.params. but password and repeatedPassword as body -> req.body
    const res: AxiosResponse = await authAxiosInstance.put(`/reset-password/${token}`, {password, repeatedPassword});
    return res;
}

async function getCurrentUser():Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.get(`/current-user`);
    return res;
}

async function resendVerificationEmail():Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.put(`/resend-verification`);
    return res;
}

async function refreshToken():Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.get(`/refresh-token`);
    return res;
}

async function seedAuthUser(type:string, count:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await authAxiosInstance.put(`/seed/${type}/${count}`);
    return res;
}


export { 
    authAxiosInstance,
    SignUp,
    SignIn,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentUser,
    resendVerificationEmail,
    refreshToken,
    seedAuthUser
}