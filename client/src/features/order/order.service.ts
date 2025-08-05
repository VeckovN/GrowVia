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
    })
})

export const {
   useCreateOrderMutation
} = orderApi;
