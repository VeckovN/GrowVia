import { FC, ReactElement } from "react";
import { NotificationInterface, NotificationsDropdowProps } from "../notifications.interface";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../../store/store";
import { useMarkNotificationAsReadMutation } from '../notifications.service';
import { makeNotificationRead } from "../notifications.reducers";
import Notification from "./Notification";

const NotificationsDropdown:FC<NotificationsDropdowProps> = ({notifications, unreadCount}):ReactElement => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [ markNotificationAsRead ] = useMarkNotificationAsReadMutation();

    const onNotificationClick = async(item:NotificationInterface):Promise<void> => {
        try{
            if (!item.isRead){
                await markNotificationAsRead(item.id);
                dispatch(makeNotificationRead(item.id));
            }
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        } finally {
            if (item.link) {
                navigate(item.link)
            }
        }
    }

    return (
        <div className='bg-red- bg-white border border-greyB rounded-md'>
            
            <div className="w-full py-2 px-5">
                <div className=''>
                    Notifications
                </div>
                <div className="font-light text-xs mt-1">
                    {unreadCount} unread notifications
                </div>
            </div>

            {/* custom-scrollbar is defined @layer utility in index.css */}
            <div className='max-h-[300px] overflow-y-auto custom-scrollbar'>
            {notifications.map(item => 
               <Notification
                    key={item.id}
                    notification={item}
                    onNotificationClick={() => onNotificationClick(item)}
               />
            )}
            </div>

        </div>
    )
}

export default NotificationsDropdown