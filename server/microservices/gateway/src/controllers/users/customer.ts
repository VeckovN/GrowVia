import { Request, Response } from "express";
import { 
    getCustomerDetailsByUsername,
    getCustomerDetailsByEmail,
    updateCustomerData, 
    addProductToWishlist, 
    removeProductFromWishlist,
    addFarmerToSavedList,
    removeFarmerFromSavedList,
    updateCustomerOrderHistory
} from "@gateway/services/user.service";
import { AxiosResponse } from "axios";

//for params
export async function getByUsername(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getCustomerDetailsByUsername(req.params.username); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function getByEmail(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getCustomerDetailsByEmail(req.params.email); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function updateByID(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await updateCustomerData(req.params.customerID, req.body); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}


export async function addToWishlist(req:Request, res:Response):Promise<void>{
    const { customerID, productID } = req.body;
    const response: AxiosResponse = await addProductToWishlist(customerID, productID); 
    res.status(200).json({ message:response.data.message});
}

export async function removeFromWishlist(req:Request, res:Response):Promise<void>{
    const { customerID, productID } = req.params;
    const response: AxiosResponse = await removeProductFromWishlist(customerID, productID); 
    res.status(200).json({ message:response.data.message});
}

export async function addToSavedList(req:Request, res:Response):Promise<void>{
    const { customerID, farmerID } = req.body;
    const response: AxiosResponse = await addFarmerToSavedList(customerID, farmerID); 
    res.status(200).json({ message:response.data.message});
}

export async function removeFromSavedList(req:Request, res:Response):Promise<void>{
    const { customerID, farmerID } =req.params;
    const response: AxiosResponse = await removeFarmerFromSavedList(customerID, farmerID); 
    res.status(200).json({ message:response.data.message});
}

export async function updateOrderHistory(req:Request, res:Response):Promise<void>{
    const { customerID, orderID } = req.body;
    const response: AxiosResponse = await updateCustomerOrderHistory(customerID, orderID); 
    res.status(200).json({ message:response.data.message});
}


