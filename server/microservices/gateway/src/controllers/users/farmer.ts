import { Request, Response } from "express";
import { 
    getFarmerDetailsByID,
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    getSerachFarmers,
    getNewestFarmers,
    updateFarmerData
} from "@gateway/services/user.service";
import { AxiosResponse } from "axios";

export async function getByID(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getFarmerDetailsByID(req.params.ID); 
    // res.status(200).json({ message:response.data.message, user:response.data.user});
    res.status(200).json({ message:response.data.message, farmer:response.data.user});
}

export async function getByUsername(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getFarmerDetailsByUsername(req.params.username); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function getByEmail(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await getFarmerDetailsByEmail(req.params.email); 
    res.status(200).json({ message:response.data.message, user:response.data.user});
}

export async function serachFarmers(req:Request, res:Response):Promise<void>{
    const from = parseInt(req.query.from as string) || 0;
    const size = parseInt(req.query.size as string) || 12;
    const farmerQuery = (req.query.farmerQuery as string) || '';

    const response: AxiosResponse = await getSerachFarmers({from, size, farmerQuery});
    res.status(200).json({ 
        message:response.data.message, 
        farmers:response.data.farmers, 
        total:response.data.total
    });
}

export async function newestFarmers(req:Request, res:Response):Promise<void>{
    const limit = parseInt(req.params.limit);
    const response: AxiosResponse = await getNewestFarmers(limit); 
    res.status(200).json({ message:response.data.message, farmers:response.data.farmers});
}

export async function updateByID(req:Request, res:Response):Promise<void>{
    const response: AxiosResponse = await updateFarmerData(req.params.farmerID, req.body); 
    res.status(200).json({ message:response.data.message, farmer:response.data.user});
}