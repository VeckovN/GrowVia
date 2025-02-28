import { Request, Response } from "express";
import { getProductByID, getFarmerProductsByID, getProductsByCategory, createProduct, updateProduct, deleteProduct, searchProducts, searchSimilarProducts} from "@gateway/services/product.service";
import { AxiosResponse } from "axios";

export async function create(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await createProduct(req.body);
    res.status(200).json({ message:response.data.message, product:response.data.product});
}

export async function getByID(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getProductByID(req.params.productID);
    res.status(200).json({ message:response.data.message, product:response.data.product});
}

export async function getByCategory(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getProductsByCategory(req.params.category);
    res.status(200).json({ message:response.data.message, products:response.data.products});
}

export async function getProductsByID(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getFarmerProductsByID(req.params.productID);
    res.status(200).json({ message:response.data.message, products:response.data.products});
}

export async function products(req:Request, res:Response):Promise<void> {
    const { from, size, type } = req.params;
    const { query, minPrice, maxPrice } = req.query; // Query parameters
    //get queries from (this merge all query props to one 'query')
    const response: AxiosResponse = await searchProducts(
        `${query}`,
        from,
        size,
        type,
        minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice ? parseInt(maxPrice as string) : undefined,
    );
    res.status(200).json({ message:response.data.message, products:response.data.products});
}

export async function similarProducts(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await searchSimilarProducts(req.params.productID);
    res.status(200).json({ message:response.data.message, products:response.data.products});
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