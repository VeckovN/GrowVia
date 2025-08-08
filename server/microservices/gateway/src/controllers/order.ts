import { Request, Response } from "express";
import { getOrderByID, getOrdersByFarmerID ,createOrder, approveOrder, orderProccess, orderDelivery, finishOrder, cancelOrder } from "@gateway/services/order.service";
import { AxiosResponse } from "axios";


export async function get(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getOrderByID(req.params.orderID);
    res.status(200).json({ message:response.data.message, order:response.data.order});
}

export async function getFarmerOrders(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getOrdersByFarmerID(req.params.farmerID);
    res.status(200).json({ message:response.data.message, orders:response.data.orders});
}

export async function create(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await createOrder(req.body);
    res.status(200).json({ message:response.data.message });
}

export async function cancel(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await cancelOrder(req.params.orderID);
    res.status(200).json({ message:response.data.message });
}

export async function approve(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await approveOrder(req.params.orderID);
    res.status(200).json({ message:response.data.message });
}

export async function startProccess(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await orderProccess(req.params.orderID);
    res.status(200).json({ message:response.data.message });
}
 
export async function startDelivery(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await orderDelivery(req.params.orderID);
    res.status(200).json({ message:response.data.message });
}
 
export async function finishDelivery(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await finishOrder(req.params.orderID);
    res.status(200).json({ message:response.data.message });
}