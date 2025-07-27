import { ResponseInterface } from "../shared/interfaces";
import { api } from "../../store/api";
import { CreateProductInterface, ProductSearchParamsInterface } from "./product.interface";


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

        getProductByFarmerID: build.query<ResponseInterface, { farmerID: string; from?: number; size?: number; sort?: string }>({
            query: ({ farmerID, from = 0, size = 12, sort = 'newest' }) => ({
                url: `product/farmer/${farmerID}`,
                params: { from, size, sort } //this data trough req.query -> this params is part of req.query on express
            }),
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

        getSimilarProducts: build.query<ResponseInterface, string>({
            query: (productID: string) => `product/search/similar/${productID}`,
            providesTags: ['Product']
        }),

        getProductsSearch: build.query<ResponseInterface, ProductSearchParamsInterface>({
            query: (paramsData) => (
                {
                url: 'product/search',
                params: {
                    ...paramsData,
                    // Convert array to comma-separated string for URL
                    subCategories: paramsData.subCategories?.join(','),
                    from: paramsData.from?.toString(),
                    size: paramsData.size?.toString(),
                    minPrice: paramsData.minPrice?.toString(),
                    maxPrice: paramsData.maxPrice?.toString(),
                    quantity: paramsData.quantity?.toString()
                }
            }),
            providesTags: ['Product']
        }),

    })
})

export const {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductByFarmerIDQuery,
    useGetNewestProductsQuery,
    useGetSimilarProductsQuery,
    useGetProductByIDQuery,
    useGetProductsSearchQuery
} = productApi