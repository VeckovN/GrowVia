import toast from 'react-hot-toast';
import { addNotification } from '../features/notifications/notifications.reducers';
import { mapNotificationsData } from '../features/shared/utils/utilsFunctions';
import { NotificationInterface } from '../features/notifications/notifications.interface';


export const registerNotificationEvents = (socket, dispatch, userID, userType) => {

    socket.on('order-notification', ({order, notification}) =>{
        const receiverID = notification.receiver.id;
        const currentUserID = String(userID);
        
        if(receiverID === currentUserID ){
            const mappedNotification:NotificationInterface = mapNotificationsData(notification, userType);
            dispatch(addNotification(mappedNotification));
            toast.success(notification.message);
        }        
    })
}