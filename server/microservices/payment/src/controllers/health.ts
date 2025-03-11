import { Request, Response } from 'express';

export const health = (_: Request, res:Response) =>{
    res.status(200).send("Payment service is OK");
}