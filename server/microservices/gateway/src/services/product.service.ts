import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { ProductCreateInterface, ProductDocumentInterface, ProductSearchOptionsInterface } from "@veckovn/growvia-shared";

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

async function searchProducts(params: ProductSearchOptionsInterface ):Promise<AxiosResponse> {
    const queryParams = {
        ...params,
        subCategories: params.subCategories?.join(',')
    }
    const res: AxiosResponse = await productAxiosInstance.get('/search', { params: queryParams });
    return res;
}


async function searchSimilarProducts(productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/search/similar/${productID}`);
    return res;
}

async function searchNewestProducts(limit: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/search/newest/${limit}`);
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
    searchSimilarProducts,
    searchNewestProducts
}
