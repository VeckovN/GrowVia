//Service to '/users' Service
import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { CustomerProfileInterface } from "./customer.interface";

interface CustomerUpdateProfilePropInterface {
    customerID: string;
    updateData: CustomerProfileInterface
}

export const customerApi = api.injectEndpoints({
    endpoints: (build) => ({
        updateCustomer: build.mutation<ResponseInterface, CustomerUpdateProfilePropInterface>({
            query({customerID, updateData}) {
                return {
                    url:`/users/customer/id/${customerID}`,
                    method: 'PATCH',
                    body: updateData
                };
            },
            invalidatesTags: ['Farmer']
        }),
    })
})

export const {
    useUpdateCustomerMutation
} = customerApi;