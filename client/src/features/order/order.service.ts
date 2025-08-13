import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { OrderRequestBodyInterface } from "./order.interface";

export const orderApi = api.injectEndpoints({
    endpoints: (build) => ({
        createOrder: build.mutation<ResponseInterface, OrderRequestBodyInterface>({
            query(createOrderData) {
                return {
                    url:`/order/create`,
                    method: 'POST',
                    body: createOrderData
                };
            },
            invalidatesTags: ['Order']
        }),
        acceptOrder: build.mutation<ResponseInterface, string>({
            query(orderID) {
                return {
                    url:`/order/approve/${orderID}`,
                    method: 'PUT',
                    body: {}
                };
            },
            invalidatesTags: ['Order']
        }),
        //packaged
        startProccess: build.mutation<ResponseInterface, string>({
            query(orderID) {
                return {
                    url:`/order/proccess/${orderID}`,
                    method: 'PUT',
                    body: {}
                };
            },
            invalidatesTags: ['Order']
        }),
        //toCourier
        startDelivery: build.mutation<ResponseInterface, string>({
            query(orderID) {
                return {
                    url:`/order/delivery/${orderID}`,
                    method: 'PUT',
                    body: {}
                };
            },
            invalidatesTags: ['Order']
        }),
        finishOrder: build.mutation<ResponseInterface, string>({
            query(orderID) {
                return {
                    url:`/order/finish/${orderID}`,
                    method: 'PUT',
                    body: {}
                };
            },
            invalidatesTags: ['Order']
        }),
        cancelOrder: build.mutation<ResponseInterface, string>({
            query(orderID) {
                return {
                    url:`/order/cancel/${orderID}`,
                    method: 'PUT',
                    body: {}
                };
            },
            invalidatesTags: ['Order']
        }),
        getOrderByID: build.query<ResponseInterface, string>({
            query: (orderID: string) => `/order/${orderID}`,
            providesTags: ['Order']
        }),
        getOrdersByFarmerID: build.query<ResponseInterface, string>({
            query: (farmerID: string) => `/order/farmer/${farmerID}`,
            providesTags: ['Order']
        }),
        getOrdersByCustomerID: build.query<ResponseInterface, string>({
            query: (customerID: string) => `/order/customer/${customerID}`,
            providesTags: ['Order']
        }),
    })
})

export const {
    useCreateOrderMutation,
    useAcceptOrderMutation,
    useStartProccessMutation,
    useStartDeliveryMutation,
    useFinishOrderMutation,
    useCancelOrderMutation,
    useGetOrderByIDQuery,
    useGetOrdersByFarmerIDQuery,
    useGetOrdersByCustomerIDQuery
   
} = orderApi;
