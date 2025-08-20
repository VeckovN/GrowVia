export interface NotificationInterface {
    id: string;  
    type: NotificationType;
    message: string;
    
    senderID: string;
    senderName: string; //farmName for Farmer user or FullName for Custoer
    senderAvatarUrl?: string;
    receiverID: string;
    receiverName: string;
    
    createdAt: string;
    isRead: boolean;

    //Specific (based on type)
    orderID?: string;
    orderStatus?: OrderStatusType; 
  
    link?: string; //will be assign on SetNotifications

    //In future i am going to have 'iot' type noticications like
    iotType?: string;
    iotSensorID?: string; 
}

export interface NotificationsStateInterface {
    unreadCount: number;
    list: NotificationInterface[];
}

export type NotificationType = "order" | "iot" | "authentication" | "rating" | "general" | "system";

//similar to the backend
export type OrderStatusType = "pending" | "accepted" | "canceled" | "processing" | "shipped" | "completed"

export interface NotificationsDropdowProps  {
    notifications: NotificationInterface[];
    unreadCount: number; 
}

export interface NotificationProps {
    notification: NotificationInterface; 
    onNotificationClick: (notification:NotificationInterface) => Promise<void>;
}


