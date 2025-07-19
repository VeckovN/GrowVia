import { Request, Response } from "express";
import { getProductByID, getFarmerProductsByID, getProductsByCategory, createProduct, updateProduct, deleteProduct, searchProducts, searchSimilarProducts, searchNewestProducts } from "@gateway/services/product.service";
import { AxiosResponse } from "axios";
import { ProductSearchOptionsInterface } from "@veckovn/growvia-shared";

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

export async function getFarmerProducts(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getFarmerProductsByID(req.params.farmerID);
    res.status(200).json({ message:response.data.message, products:response.data.products});
}


export async function products(req:Request, res:Response):Promise<void> {

    const { 
        query,
        category,
        subCategories,
        minPrice,
        maxPrice,
        location,
        quantity,
        unit,
        sort,
        from = '0',      
        size = '12'     
    } = req.query;

    const paramsData:ProductSearchOptionsInterface = {
        query: query as string,
        category: category as string,
        subCategories: subCategories?.toString().split(','),
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        location: location as string,
        quantity: quantity ? Number(quantity) : undefined,
        unit: unit as string,
        sort: sort as 'relevant' | 'price_asc' | 'price_desc' | 'newest',
        from: Number(from),
        size: Number(size)
    }

    const response: AxiosResponse = await searchProducts(paramsData);
    res.status(200).json({ message:response.data.message, products:response.data.products, total:response.data.total});
}

export async function similarProducts(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await searchSimilarProducts(req.params.productID);
    res.status(200).json({ message:response.data.message, products:response.data.products});
}

export async function newestProducts(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await searchNewestProducts(req.params.limit);
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