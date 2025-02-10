import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { CustomerDocumentInterface, FarmerDocumentInterface } from "@veckovn/growvia-shared"

const usersAxiosInstance = createAxiosInstance(`${config.USER_SERVICE_URL}/api/v1/users`, 'user');

// Customer
async function getCustomerDetailsByUsername(username: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.get(`/customer/username/${username}`);
    return res;
}

async function getCustomerDetailsByEmail(email: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.get(`/customer/email/${email}`);
    return res;
}

async function updateCustomerData(customerID: string, newData: CustomerDocumentInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.put(`/customer/id/${customerID}`, newData);
    //newData is structured as obj with new Data props
    return res;
}

async function addProductToWishlist(customerID: string, productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.post(`/customer/wishlist`, { customerID, productID });
    return res;
}

//customer/:customerID/wishlist/:productID
async function removeProductFromWishlist(customerID: string, productID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.delete(`/customer/${customerID}/wishlist/${productID}`);
    return res;
}

async function addFarmerToSavedList(customerID: string, farmerID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.post(`/customer/savedlsit`, { customerID, farmerID });
    return res;
}

async function removeFarmerFromSavedList(customerID: string, farmerID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.delete(`/customer/${customerID}/savedlist/${farmerID}`);
    return res;
}

async function updateCustomerOrderHistory(customerID: string, orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.post(`/customer/add/order-history`, { customerID, orderID });
    return res;
}


// Farmer
async function getFarmerDetailsByUsername(username: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.get(`/farmer/username/${username}`);
    return res;
}

async function getFarmerDetailsByEmail(email: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.get(`/farmer/email/${email}`);
    return res;
}

async function updateFarmerData(farmerID: string, newData: FarmerDocumentInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await usersAxiosInstance.put(`/farmer/id/${farmerID}`, newData);
    return res;
}


export {
    usersAxiosInstance,
    getCustomerDetailsByUsername,
    getCustomerDetailsByEmail,
    updateCustomerData,
    addProductToWishlist,
    removeProductFromWishlist,
    addFarmerToSavedList,
    removeFarmerFromSavedList,
    updateCustomerOrderHistory,
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    updateFarmerData
}