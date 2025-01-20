//Axios service
import axios from 'axios';
import { sign } from "jsonwebtoken";
import { config } from '@gateway/config';

//We want to append GATEWAY_JTW_TOKEN and set header to request  

// in services/api this createAxiosInstance will be used to do  api Requests(HTTP) to the Microservices
//-ApiGataway to Microservices
export function createAxiosInstance(baseUrl:string , service?:string): ReturnType<typeof axios.create>{
    //baseURL -> of each service where we create axios instance (for example 'auth', 'user' ...)
    //service (service name) That we want to add JWT token 

    //set GatewayToken (that will be passed to request and be check with middleware on every request does it exist)
    //the gateway-middleware checks does this gatewayToken exist on request header( req.header.gatewayToken)
    let requestGatewayToken:string = " ";

    //if we create instnace for some service(for example 'order') the service parameter is passed
    //and the token will be generated(signed)

    if(service){ //If the service doesn't exist it will return error (in auth-middleware) and token wont be generated
        //id repesent service name,  ('order')
        //and pass GATEWAY_JWT_TOKEN as Private key for 
        requestGatewayToken = sign({id:service}, `${config.GATEWAY_JWT_TOKEN}`)
    }

    //add it to the request
    return axios.create({
        baseURL:baseUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            gatewayToken: requestGatewayToken //it will be checked in auth-middleware
        }
    })

}