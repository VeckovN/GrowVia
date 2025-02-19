import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { ProductCreateInterface, ProductDocumentInterface } from "@veckovn/growvia-shared";

const productAxiosInstance = createAxiosInstance(`${config.PRODUCT_SERVICE_URL}/api/v1/product`, 'product');

async function getProductByID(productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await productAxiosInstance.get(`/${productID}`);
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
    createProduct,
    updateProduct,
    deleteProduct
}
