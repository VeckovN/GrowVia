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
        
        })
        ,
        // getProductByFarmerID: build.query<ResponseInterface, string>({
        getProductByFarmerID: build.query<ResponseInterface, number>({
            // query: (farmerID: string) => `product/farmer/${farmerID}`
            query: (farmerID: number) => `/product/farmer/${farmerID}`,
            providesTags: ['Product']
        })
    })
})


export const {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductByFarmerIDQuery
} = productApi