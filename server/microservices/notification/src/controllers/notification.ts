import {  NotificationInterface } from '@veckovn/growvia-shared';
import { Request, Response } from 'express';
// import { z } from 'zod';
// import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
import { getNotificationsByID, makeReadNotification } from '@notification/services/notification';


const getNotifications = async(req:Request, res:Response):Promise<void> => {
    const notifications: NotificationInterface[] = await getNotificationsByID(req.params.userID);
    res.status(200).json({message: "User Notifications", notifications});
}

const markNotification = async(req:Request, res:Response):Promise<void> => {
    const updateNotification: NotificationInterface = await makeReadNotification(req.body.notificationID);
    res.status(200).json({message: "Notification marked as read", notification:updateNotification });
}

export {
    getNotifications,
    markNotification
}