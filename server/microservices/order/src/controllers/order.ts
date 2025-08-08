import { OrderDocumentInterface, BadRequestError } from '@veckovn/growvia-shared';
import { OrderCreateZodSchema } from '@order/schema/order.schema';
import { z } from 'zod';
import { Request, Response } from 'express';
import {
    placeOrder,
    farmerApproveOrder,
    cancelOrder,
    getOrderByID,
    getFarmerOrders,
    farmerStartOrderProccess,
    farmerStartOrderDelivery,
    farmerFinishOrderDelivery
}

from "@order/services/order";

const getOrder = async(req:Request, res:Response):Promise<void> => {
    const order: OrderDocumentInterface | null = await getOrderByID(req.params.orderID);
    res.status(200).json({message:"Order data by orderID", order: order});
}   

const getOrdersByFarmerID = async(req:Request, res:Response):Promise<void> => {
    const orders: OrderDocumentInterface[] | null = await getFarmerOrders(req.params.farmerID);
    res.status(200).json({message:"Orders data by farmerID", orders: orders});
}   

const placeCustomerOrder = async(req:Request, res:Response):Promise<void> => {
    try{
        OrderCreateZodSchema.parse(req.body);
        await placeOrder(req.body);
        res.status(200).json({message:"Customer order created - pending:"});
    }
    catch(error){
        if(error instanceof z.ZodError){ 
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            
            //this throws error that returns res.status(error.statusCode) as middleware - in server.ts)
            throw BadRequestError(`Invalid form data, error: ${JSON.stringify(errorMessages)} `, 'productCustomerZodSchema validation');
        } 
    }
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
    getOrdersByFarmerID,
    placeCustomerOrder,
    cancelPlacedOrder,
    approveOrder,
    startOrderProccess,
    startOrderDelivery,
    finishOrder
}