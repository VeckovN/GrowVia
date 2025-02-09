import { Request, Response } from "express";
import { AxiosResponse } from "axios";
import { seedAuthUser } from "@gateway/services/auth.service";

export async function seedUser(req:Request, res:Response):Promise<void>{
    const {type, count} = req.params;
    const response: AxiosResponse = await seedAuthUser(type, count);
    res.status(200).json({message:response.data.message});
}