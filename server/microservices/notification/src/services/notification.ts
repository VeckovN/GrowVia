import { NotificationInterface } from "@veckovn/growvia-shared";
import { NotificationModel } from "@notification/model/notification";

const storeNotification = async(notification: NotificationInterface): Promise<NotificationInterface> => {
    const data:NotificationInterface = await NotificationModel.create(notification);
    return data;
}

//get first 10
const getNotificationsByID = async(userID: string): Promise<NotificationInterface[]> => {
    //TODO: paggination
    const notifications: NotificationInterface[] = await NotificationModel.find({"receiver.id": userID})
        .sort({ createdAt: -1})
        .limit(10)
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