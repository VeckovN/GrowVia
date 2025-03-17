import { createAxiosInstance } from "@gateway/axios";
import { config } from '@gateway/config';
import { AxiosResponse } from "axios";
import { OrderCreateInterface } from "@veckovn/growvia-shared";

const orderAxiosInstance = createAxiosInstance(`${config.ORDER_SERVICE_URL}/api/v1/order`, 'order');

async function createOrder(product: OrderCreateInterface):Promise<AxiosResponse> {
    const res: AxiosResponse = await orderAxiosInstance.post(`/create`, product);
    return res;
}

export {
    orderAxiosInstance,
    createOrder
}