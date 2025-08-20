import { api } from "../../store/api";
import { ResponseInterface } from '../shared/interfaces';

const notificationApi = api.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<ResponseInterface, string>({
            query: (userID: string) => `/notification/${userID}`,
            providesTags: ['Notifications']
        }),
        markNotificationAsRead: build.mutation<ResponseInterface, string>({
            query(notificationID) {
                return {
                    url: '/notification/mark',
                    method: 'PUT',
                    body: { notificationID }
                };
            },
            invalidatesTags: ['Notifications']
        }),
    })
});

export const {
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery, // to manually trigger on demand 
    useMarkNotificationAsReadMutation
} = notificationApi