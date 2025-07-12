import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";

// import { CreateProductInterface, ProductDocumentInterface} from "./product.interface";
import { CreateProductInterface } from "./product.interface";

export const productApi = api.injectEndpoints({
    endpoints: (build) => ({
        createProduct: build.mutation<ResponseInterface, CreateProductInterface>({
            query(body) {
                console.log("BPOD: ",body);
                return {
                    url:'/product/create',
                    method: 'POST',
                    body
                };
            },
            invalidatesTags: ['Product']
        }),
        deleteProduct: build.mutation<ResponseInterface, {productID: string, farmerID: string}>({
            query({productID, farmerID}) {
                return {
                    url:`/product/${productID}/${farmerID}`,
                    method: 'DELETE'
                };
            },
            invalidatesTags: ['Product']
        
        }),
        getProductByFarmerID: build.query<ResponseInterface, string>({
            query: (farmerID: string) => `product/farmer/${farmerID}`,
            providesTags: ['Product']
        }),

        getProductByID: build.query<ResponseInterface, string>({
            query: (productID: string) => `product/${productID}`,
            providesTags: ['Product']
        }),

        getNewestProducts: build.query<ResponseInterface, string>({
            query: (limit: string) => `product/search/newest/${limit}`,
            providesTags: ['Product']
        }),

    })
})


export const {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductByFarmerIDQuery,
    useGetNewestProductsQuery,
    useGetProductByIDQuery
} = productApi