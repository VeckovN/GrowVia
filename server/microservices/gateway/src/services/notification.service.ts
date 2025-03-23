import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";

const notificationAxiosInstance = createAxiosInstance(`${config.NOTIFICATION_SERVICE_URL}/api/v1/notification`, 'notification');

async function getNotificationsByUserID(userID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await notificationAxiosInstance.get(`/${userID}`);
    return res;
}

async function markNotificationAsRead(notificationID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await notificationAxiosInstance.put(`/mark`, { notificationID });
    return res;
}

export { 
    notificationAxiosInstance, 
    getNotificationsByUserID,
    markNotificationAsRead
}