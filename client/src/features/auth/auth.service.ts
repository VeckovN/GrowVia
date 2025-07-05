import { api } from "../../store/api";
import { SignUpPayloadInterface, SignInPayloadInterface, ResetPasswordPayloadInterface, VerifyEmailInterface, ChangePasswordPayloadInterface } from "./auth.interfaces";
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
        }),
        forgotPassword: build.mutation<ResponseInterface, string>({
            query(email) {
                return {
                    url: '/auth/forgot-password',
                    method: 'PUT',
                    body: { email }
                };
            },
            invalidatesTags: ['Auth']
        }),
        //request Data: {password, confirmPassword, token -> taken from url} -> 
        resetPassword: build.mutation<ResponseInterface, ResetPasswordPayloadInterface>({
            query({password, confirmPassword, token}) { //data in object
                return {
                    url: `/auth/reset-password/${token}`,
                    method: 'PUT',
                    body: {
                        password,
                        repeatedPassword: confirmPassword, // match backend field
                    }
                };
            },
            invalidatesTags: ['Auth']
        }),
        resentEmailVerification: build.mutation<ResponseInterface, void>({
            query() { //data in object
                return {
                    url: `/auth/resend-verification`,
                    method: 'PUT',
                    body:{}
                };
            },
            invalidatesTags: ['Auth']
        }),
        verifyEmail: build.mutation<ResponseInterface, VerifyEmailInterface>({
            query({userID, token}){
                return {
                    url: 'auth/verify-email',
                    method: 'PUT',
                    body: {
                        userID,
                        token 
                    }
                }
            }
        }),
        changePassword: build.mutation<ResponseInterface, ChangePasswordPayloadInterface>({
            query({currentPassword, newPassword}){
                return {
                    url: 'auth/change-password',
                    method: 'PATCH',
                    body: {
                        currentPassword,
                        newPassword
                    }
                }
            }
        }),
        getCurrentUser: build.query<ResponseInterface, void>({
            query: () => 'auth/current-user',
            providesTags: ['Auth']
        })
    })
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useResentEmailVerificationMutation,
    useVerifyEmailMutation,
    useChangePasswordMutation,
    useGetCurrentUserQuery
} = authApi;

//with http we have get,post,put delete
//For GET request we'll use 'build.query()' -> with use-FN-Query Hook
//For POST,PUT and DELETE we'll use 'build.mutation()' -> we want to mutate->change data on BE -> with use-FN-Mutation hook