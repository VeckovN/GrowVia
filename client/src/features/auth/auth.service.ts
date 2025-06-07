import { api } from "../../store/api";
import { AuthUserInterface, SignUpPayloadInterface, SignInPayloadInterface} from "./auth.interfaces";
import { ResponseInterface } from '../shared/interfaces';

//api -> already created (use same instance)

const authApi = api.injectEndpoints({ //in api(createApi) we'we created endpoints as empty callback func
    //we inject endpoint for individual 'service/feature'
    endpoints: (build) => ({
        //we got response as { message,user }  that implements ResponseInterface 
        //the user fetch data is in 'user' proop
        signUp: build.mutation<ResponseInterface, SignUpPayloadInterface>({
            query(body: SignUpPayloadInterface) {
                return {
                    url: '/auth/signup',
                    method: 'POST',
                    body
                };
            },
            //anytime this method called, we want to invalidate any data related to this request 
            //Want to invalidate it in the cache (new data fetched)  -> with "Auth" Tag
            invalidatesTags: ['Auth']
        }),
        signIn: build.mutation<ResponseInterface, SignInPayloadInterface>({
            query(body: SignInPayloadInterface) {
                return {
                    url: '/auth/signin',
                    method: 'POST',
                    body
                };
            },
            invalidatesTags: ['Auth']
        }),
        logout: build.mutation<ResponseInterface, void>({
            query() {
                return {
                    url: '/auth/signout',
                    method: 'POST'
                };
            },
            invalidatesTags: ['Auth']
        })
    })
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useLogoutMutation
} = authApi;

//with http we have get,post,put delete
//For GET request we'll use 'build.query()' -> with use-FN-Query Hook
//For POST,PUT and DELETE we'll use 'build.mutation()' -> we want to mutate->change data on BE -> with use-FN-Mutation hook