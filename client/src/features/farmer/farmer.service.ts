//Service to '/users' Service
import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { FarmerProfileInterface } from "./farmer.interface";
import { SearchParamsInterface } from "../market/market.interface";
// SearchParamsInterface

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
            invalidatesTags: ['Farmer']
        }),
        getFarmerByID: build.query<ResponseInterface, string>({
            query: (ID: string) => `/users/farmer/id/${ID}`,
            providesTags: ['Farmer']
        }),
        getNewestFarmers: build.query<ResponseInterface, number>({
            query: (limit: number) => `/users/farmer/newest/${limit}`,
            providesTags: ['Farmer']
        }),
        getFarmersSearch: build.query<ResponseInterface, SearchParamsInterface>({
            query: (paramsData) => (
                {
                url: '/users/farmer/search',
                params: {
                    farmerQuery: paramsData.farmerQuery?.toString(),
                    from: paramsData.from?.toString(),
                    size: paramsData.size?.toString(),
                }
            }),
            providesTags: ['Farmer']
        }),
    })
})


export const {
    useUpdateFarmerMutation,
    useGetFarmerByIDQuery,
    useGetNewestFarmersQuery,
    useGetFarmersSearchQuery
} = farmerApi;