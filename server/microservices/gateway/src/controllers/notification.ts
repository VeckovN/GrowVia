import { Request, Response } from "express";
import { getNotificationsByUserID, markNotificationAsRead } from "@gateway/services/notification.service";
import { AxiosResponse } from "axios";

export async function get(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await getNotificationsByUserID(req.params.userID);
    res.status(200).json({ message:response.data.message, notifications:response.data.notifications });
}

export async function mark(req:Request, res:Response):Promise<void> {
    const response: AxiosResponse = await markNotificationAsRead(req.body.notificationID);
    res.status(200).json({ message:response.data.message, notification:response.data.notification });
}