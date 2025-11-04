//Service to '/users' Service
import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { CustomerUpdateProfilePropInterface, CustomerWishlistInterface } from "./customer.interface";


export const customerApi = api.injectEndpoints({
    endpoints: (build) => ({
        updateCustomer: build.mutation<ResponseInterface, CustomerUpdateProfilePropInterface>({
            query({ customerID, updateData }) {
                return {
                    url:`/users/customer/id/${customerID}`,
                    method: 'PATCH',
                    body: updateData
                };
            },
            invalidatesTags: ['Farmer']
        }),
        addItemToWishlist: build.mutation<ResponseInterface, CustomerWishlistInterface>({
            query({ customerID, productID }) {
                return {
                    url:`/users/customer/wishlist`,
                    method: 'post',
                    body: {customerID, productID}
                };
            },
            invalidatesTags: ['Farmer']
        }),
        removetItemFromWishlist: build.mutation<ResponseInterface, CustomerWishlistInterface>({
            query({ customerID, productID }) {
                return {
                    url:`/users/customer/${customerID}/wishlist/${productID}`,
                    method: 'delete',
                };
            },
            invalidatesTags: ['Farmer']
        })
    })
})

export const {
    useUpdateCustomerMutation,
    useAddItemToWishlistMutation,
    useRemovetItemFromWishlistMutation
} = customerApi;