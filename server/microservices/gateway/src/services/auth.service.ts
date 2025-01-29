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

export { 
    authAxiosInstance,
    SignUp  
}

