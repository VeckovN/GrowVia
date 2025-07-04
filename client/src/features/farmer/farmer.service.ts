//Service to '/users' Service
import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { FarmerProfileInterface } from "./farmer.interface";

// import { CreateProductInterface, ProductDocumentInterface} from "./product.interface";
// import { CreateProductInterface } from "./product.interface";

interface FarmerUpdateProfilePropInterface {
    farmerID: string;
    updateData: FarmerProfileInterface
}

export const farmerApi = api.injectEndpoints({
    endpoints: (build) => ({
        updateFarmer: build.mutation<ResponseInterface, FarmerUpdateProfilePropInterface>({
            query({farmerID, updateData}) {
                return {
                    url:`/users/farmer/id/${farmerID}`,
                    method: 'PATCH',
                    body: updateData
                };
            },
            invalidatesTags: ['Product']
        }),
    })
})


export const {
    useUpdateFarmerMutation
} = farmerApi;