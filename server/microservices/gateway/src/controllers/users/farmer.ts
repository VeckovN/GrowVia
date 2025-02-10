import { Request, Response } from "express";
import { 
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    updateFarmerData
} from "@gateway/services/user.service";
import { AxiosResponse } from "axios";

export async function getByUsername(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getFarmerDetailsByUsername(req.params.username); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function getByEmail(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getFarmerDetailsByEmail(req.params.email); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function updateByID(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await updateFarmerData(req.params.farmerID, req.body); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}