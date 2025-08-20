import { FC, ReactElement } from "react";
import { NotificationProps } from "../notifications.interface";
import { formatDistanceToNow } from 'date-fns';

// import testUserImage from '../../../assets/header/CustomerTest.svg';

const Notification:FC<NotificationProps> = ({notification, onNotificationClick}):ReactElement => {

    return (
        <div 
            className={`w-full border-t border-greyB py-1 cursor-pointer ${
                !notification.isRead ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => onNotificationClick(notification)}
        >
            <div className='w-full flex items-center gap-x-4 px-5'>
                {/* <img
                    className='w-8 h-8'
                    src={testUserImage}
                /> */}

                <div className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-normal text-gray-800'}`}> 
                    {notification.message}
                </div>
            </div>

            <div className='flex justify-end pr-2 text-xs pt-1'>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </div>           
        </div>
    )
}
export default Notification;