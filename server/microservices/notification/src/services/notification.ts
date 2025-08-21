import { NotificationInterface } from "@veckovn/growvia-shared";
import { NotificationModel } from "@notification/model/notification";
import mongoose from 'mongoose'


const storeNotification = async(notification: NotificationInterface): Promise<NotificationInterface> => {
    const notificationObject:NotificationInterface = {
        ...notification,
        receiverID: new mongoose.Types.ObjectId(notification.receiverID),
        senderID: new mongoose.Types.ObjectId(notification.senderID)
    }
    
    const data:NotificationInterface = await NotificationModel.create(notificationObject);
    return data;
}

const getNotificationsByID = async(userID: string): Promise<NotificationInterface[]> => {
    //TODO: paggination
    const notifications: NotificationInterface[] = await NotificationModel.find({receiverID: userID});
    return notifications;
}

const makeReadNotification = async(notificationID: string) => {
    const updatedNotification: NotificationInterface = await NotificationModel.findOneAndUpdate(
        { _id: notificationID },
        {
            $set: {
                isRead: true
            }
        },
        { new: true }
    ) as NotificationInterface //as Notification to avoid " Type 'null' is not assignable to type 'NotificationInterface"
    return updatedNotification;
}

export {
    storeNotification,
    getNotificationsByID,
    makeReadNotification,
}