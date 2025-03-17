import { Request, Response } from "express";
import { createOrder } from "@gateway/services/order.service";
import { AxiosResponse } from "axios";

export async function create(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await createOrder(req.body);
    res.status(200).json({ message:response.data.message, product:response.data.product});
}