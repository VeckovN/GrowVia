import { Request, Response } from "express";
import { getProductByID, createProduct, updateProduct, deleteProduct } from "@gateway/services/product.service";
import { AxiosResponse } from "axios";

export async function create(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await createProduct(req.body);
    res.status(200).json({ message:response.data.message, product:response.data.product});
}

export async function getByID(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getProductByID(req.params.productID);
    res.status(200).json({ message:response.data.message, product:response.data.product});
}

export async function update(req:Request, res:Response):Promise<void> {
    // productID:string, product: ProductDocumentInterface
    const response: AxiosResponse = await updateProduct(req.params.productID, req.body); 
    res.status(200).json({ message:response.data.message, product:response.data.product});
}

export async function deleteByID(req:Request, res:Response):Promise<void> {
    const { productID, farmerID } = req.params;
    const response: AxiosResponse = await deleteProduct(productID, farmerID); 
    res.status(200).json({ message:response.data.message });
}