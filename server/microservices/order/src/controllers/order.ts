import { OrderDocumentInterface } from '@veckovn/growvia-shared';
import { Request, Response } from 'express';
import {
    placeOrder,
    farmerApproveOrder,
    cancelOrder,
    getOrderByID,
    farmerStartOrderProccess,
    farmerStartOrderDelivery,
    farmerFinishOrderDelivery
}

from "@order/services/order";

const getOrder = async(req:Request, res:Response):Promise<void> => {
    const order: OrderDocumentInterface | null = await getOrderByID(req.params.orderID);
    res.status(200).json({message:"Order data by orderID", order: order});
}   

const placeCustomerOrder = async(req:Request, res:Response):Promise<void> => {
    await placeOrder(req.body);
    res.status(200).json({message:"Customer order created - pending:"});
}

//approve/${orderID}
const approveOrder = async(req:Request, res:Response):Promise<void> => {
    await farmerApproveOrder(req.params.orderID);
    res.status(200).json({message:`Farmer approved order`});
}

const cancelPlacedOrder = async(req:Request, res:Response):Promise<void> => {
    await cancelOrder(req.params.orderID);
    res.status(200).json({message:`Farmer canceled order`});
}

const startOrderProccess = async(req:Request, res:Response):Promise<void> => {
    await farmerStartOrderProccess(req.params.orderID);
    res.status(200).json({message:`Farmer started the order proccess - packing`});
}

const startOrderDelivery = async(req:Request, res:Response):Promise<void> => {
    await farmerStartOrderDelivery(req.params.orderID);
    res.status(200).json({message:`Farmer started the order delivery`});
}

const finishOrder = async(req:Request, res:Response):Promise<void> => {
    await farmerFinishOrderDelivery(req.params.orderID);
    res.status(200).json({message:`Order successfully delivered`});
}

export {
    getOrder,
    placeCustomerOrder,
    cancelPlacedOrder,
    approveOrder,
    startOrderProccess,
    startOrderDelivery,
    finishOrder
}