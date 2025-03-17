import { Request, Response } from 'express';
import {
    placeOrder,
}

from "@order/services/order";

const placeCustomerOrder = async(req:Request, res:Response):Promise<void> => {
    await placeOrder(req.body);
    res.status(200).json({message:"Customer order created - pending:"});
}

export {
    placeCustomerOrder,
}