import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const BASE_ENDPOINT = 'http://localhost:4000';

const baseQuery = fetchBaseQuery({
    //every request is sent to the API Gateway service 
    baseUrl: `${BASE_ENDPOINT}/api/gateway/v1`,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        headers.set('Accpet', 'application/json');
        return headers;
    },
    credentials: 'include'
});

//interceptor -> check if our token has expired, then we send a request to re-new the token
const baseQueryAuthInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) =>{
    const result = await baseQuery(args, api, extraOptions);
    if(result.error && result.error.status === 401){
        // const loggedUsername from session storage -> stored on signin
        const endpoint = 'refresh-token';
        await baseQuery(`/auth/${endpoint}`, api, extraOptions);
    }
    return result;
}

export const api = createApi({
    reducerPath: 'clientApi',
    baseQuery: baseQueryAuthInterceptor,
    //use these properites to know which values or data to CACHE and VALIDATE
    tagTypes: ['Auth', 'CurrentUser', 'Customer', 'Farmer', 'Product', 'Order'],   
    endpoints: () => ({}) //since the different features have their own api definations, we'll just add a callback here
})