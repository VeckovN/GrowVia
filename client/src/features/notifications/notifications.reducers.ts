import { createSlice, Slice, PayloadAction} from "@reduxjs/toolkit";
import { NotificationsStateInterface, NotificationInterface } from "./notifications.interface";

export const initialNotifications: NotificationsStateInterface= {
    unreadCount: 0,
    list: []
};

const notificationsSlice: Slice = createSlice({
    name: 'notifications',
    initialState: initialNotifications,
    reducers: {
        //set notificaion on user login 
        setNotifications: (state, action: PayloadAction<NotificationInterface[]>) => {
            state.list = action.payload;
            state.unreadCount = action.payload.filter(item => !item.isRead).length;
        },
        addNotification: (state, action: PayloadAction<NotificationInterface>) => {
            state.list.unshift(action.payload);
            if(!action.payload.isRead){
                state.unreadCount += 1;
            }
        },
        makeNotificationRead:(state, action: PayloadAction<string>) => {
            const notification = state.list.find(item => item.id === action.payload); 
            if( notification && !notification.isRead){
                notification.isRead = true; //automatically changed 
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        //Mark all displayed notifications 
        markAllRead: (state) => {
            state.list.forEach(item => item.isRead = true);
            state.unreadCount = 0;
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const notification = state.list.find(item => item.id === action.payload);
            if (notification && !notification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        clearNotifications: () => initialNotifications
    },
});

export default notificationsSlice.reducer;
export const clearNotifications = notificationsSlice.actions.clearNotifications as () => PayloadAction<undefined>;
export const { setNotifications, addNotification, makeNotificationRead, markAllRead, removeNotification } = notificationsSlice.actions;