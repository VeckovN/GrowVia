import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { OrderCreateInterface } from "@veckovn/growvia-shared";

const orderAxiosInstance = createAxiosInstance(`${config.ORDER_SERVICE_URL}/api/v1/order`, 'order');

async function getOrderByID(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.get(`/${orderID}`);
    return res;
}

async function getOrdersByFarmerID(farmerID: string, from:number, size:number, sort:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.get(`/farmer/${farmerID}`, {
        params: { from, size, sort }
    });
    return res;
}

async function getOrdersByCustomerID(customerID: string, from:number, size:number, sort:string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.get(`/customer/${customerID}`, {
        params: { from, size, sort }
    });
    return res; 
}

async function createOrder(product: OrderCreateInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.post(`/create`, product);
    return res;
}

async function cancelOrder(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.put(`/cancel/${orderID}`);
    return res;
}

async function approveOrder(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.put(`/approve/${orderID}`);
    return res;
}

async function orderProccess(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.put(`/proccess/${orderID}`);
    return res;
}

async function orderDelivery(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.put(`/delivery/${orderID}`);
    return res;
}

async function finishOrder(orderID: string):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.put(`/finish/${orderID}`);
    return res;
}


export {
    orderAxiosInstance,
    getOrderByID,
    getOrdersByFarmerID,
    getOrdersByCustomerID,
    createOrder,
    cancelOrder,
    approveOrder,
    orderProccess,
    orderDelivery,
    finishOrder
}