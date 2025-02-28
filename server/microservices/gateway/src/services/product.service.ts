import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { ProductCreateInterface, ProductDocumentInterface } from "@veckovn/growvia-shared";

const productAxiosInstance = createAxiosInstance(`${config.PRODUCT_SERVICE_URL}/api/v1/product`, 'product');

async function getProductByID(productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/${productID}`);
    return res;
}

async function getProductsByCategory(category: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/category/${category}`);
    return res;
}

async function getFarmerProductsByID(farmerID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/farmer/${farmerID}`);
    return res;
}

async function searchProducts(query: string, from:string, size: string, type:string, minPrice?:number, maxPrice?:number ):Promise<AxiosResponse> {
    // const res: AxiosResponse = await productAxiosInstance.get(`/search/${from}/${size}/${type}?query=${query}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    //better practice to use 'params' that is related to 'req.query' instead of passing it directly to URL
    //url looks like: /search/0/10/forward/?query=''&minPrice=''&maxPrice=''
    const res: AxiosResponse = await productAxiosInstance.get(`/search/${from}/${size}/${type}`, {
        params: { query, minPrice, maxPrice }
    });
    return res;
}

async function searchSimilarProducts(productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/search/similar/${productID}`);
    return res;
}

async function createProduct(product: ProductCreateInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.post(`/create`, product);
    return res;
}

async function updateProduct(productID:string, product: ProductDocumentInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.put(`/${productID}`, product);
    return res;
}

async function deleteProduct(productID:string, farmerID:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.delete(`/${productID}/${farmerID}`,);
    return res;
}


export {
    productAxiosInstance,
    getProductByID,
    getFarmerProductsByID,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    searchSimilarProducts
}
