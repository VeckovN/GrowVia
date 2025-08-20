import { AppDispatch } from "../../../store/store";
import { CartProductInterface } from "../../cart/cart.interface";
import { addProduct, increaseProduct, decreaseProduct, removeProduct } from "../../cart/cart.reducers";
import { NotificationInterface } from "../../notifications/notifications.interface";

export const saveDataToLocalStorage = (key: string, data: string): void =>{
    //data object should be JSON stringified
    window.localStorage.setItem(key, data);
}

export const getDataFromLocalStorage = (key: string) =>{
    const data:string = window.localStorage.getItem(key) as string;
    return JSON.parse(data); //convert from string to JSON object
}

export const removeDataFromLocalStorage = (key:string): void => {
    window.localStorage.removeItem(key);
}

export const saveDataToSessionStorage = (data: string, username: string): void =>{
    window.sessionStorage.setItem('isLoggedIn', data); //true/false
    window.sessionStorage.setItem('loggedInUser', username); //
}

export const removeUserFromSessionStorage = (): void => {
    window.sessionStorage.removeItem('isLoggedIn'); 
    window.sessionStorage.removeItem('loggedInUser'); 
}

export const getDataFromSessionStorage = (key: string) => {
    const data:string = window.sessionStorage.getItem(key) as string;
    return JSON.parse(data);
}

export const removeDataFromSessionStorege = (key: string) =>{
    window.sessionStorage.removeItem(key);
}

export const readAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const handleAddToCart = (
    dispatch: AppDispatch,
    farmerID: string,
    farmName: string,
    product: CartProductInterface
): void => {
    dispatch(addProduct({farmerID, farmName, product}));
}

export const handleCartItemIncrease = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(increaseProduct({farmerID, productID}));
}

export const handleCartItemDecrease = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(decreaseProduct({farmerID, productID}));
}

export const handleRemoveCartItem = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(removeProduct({farmerID, productID}));
}

//map backend order statuses to UI related labels
export const mapOrderStatusToUILabel = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'Requested';
        case 'accepted':
            return 'Accepted';
        case 'processing':
            return 'Packaged';
        case 'shipped':
            return 'To Courier';
        case 'completed':
            return 'Delivered';
        case 'canceled':
            return 'Canceled';
        case 'rejected':
            return 'Canceled';
        default:
            return 'Unknown';
    }
}; 

export const getOrderBackgroundColor = (uiStatus: string): string => {
    switch (uiStatus) {
        case 'pending':
            return 'bg-gray-100';
        case 'accepted':
            return 'bg-blue-100';
        case 'processing':
            return 'bg-indigo-200';
        case 'shipped':
            return 'bg-yellow-100';
        case 'completed':
            return 'bg-green-100';
        case 'canceled':
            return 'bg-red-100';
        case 'rejected':
            return 'bg-red-100';
        default:
            return 'bg-gray-200';
    }
};

export const mapOrderCustomerStatusToUILabel = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'Requested';
        case 'accepted':
            return 'In progress';
        case 'processing':
            return 'In progress';
        case 'shipped':
            return 'In progress';
        case 'completed':
            return 'Delivered';
        case 'canceled':
            return 'Canceled';
        case 'rejected':
            return 'Canceled';
        default:
            return 'Unknown';
    }
}; 

export const getCustomerOrderBackgroundColor = (uiStatus: string): string => {
    switch (uiStatus) {
        case 'pending':
            return 'bg-gray-400';
        case 'accepted':
            return 'bg-yellow-400';
        case 'processing':
            return 'bg-yellow-400';
        case 'shipped':
            return 'bg-yellow-400';
        case 'completed':
            return 'bg-green-400';
        case 'canceled':
            return 'bg-red-400';
        case 'rejected':
            return 'bg-red-400';
        default:
            return 'bg-gray-400';
    }
};

export const formatOrderDate = (createdAt: string | Date): string => {
    const date = new Date(createdAt);
    const day = date.getDate();
    // const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

//DON't FORGET FOR PR: 
// - install date-fns liobrary to calculate the time elapsed until the notifications was received
export const mapNotificationsData = (n: any, userType: string): NotificationInterface => {
    return {
        id: n._id,
        type: n.type,
        message: n.message,

        senderID: n.sender?.id ?? "",
        senderName: n.sender?.name ?? "",
        senderAvatarUrl: n.sender?.avatarUrl ?? undefined,
        receiverID: n.receiver?.id ?? "",
        receiverName: n.receiver?.name ?? "",

        createdAt: n.createdAt,
        isRead: n.isRead, // BE => FE rename

        orderID: n.order?.orderId ?? undefined,
        orderStatus: n.order?.status ?? undefined,

        //for all n.type ==='order' instead when is n.order?.status === 'pending' it chould lead to /order/view
        link: n.type === "order" 
        ? 
            n.order?.status === 'pending' && userType === 'farmer'
                ? `/order/overview/${n.order?.orderId}`
                : `/order/track/${n.order?.orderId}`
        :
            undefined
    };
}