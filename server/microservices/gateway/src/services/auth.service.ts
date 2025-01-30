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

async function verifyEmail(body: AuthBodyRequestInterface):Promise<AxiosResponse> {
    //email is passed throught body as well, -> req.body.email
    const res: AxiosResponse = await authAxiosInstance.put('/verify-email', body);
    return res;
}

async function changePassword(newPassword:string):Promise<AxiosResponse> {
    //make request with newPassword in body to the Authentication servcice
    const res: AxiosResponse = await authAxiosInstance.put('/change-password', { newPassword });
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


export { 
    authAxiosInstance,
    SignUp,
    SignIn,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword
}

