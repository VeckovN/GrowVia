import { FC, ReactElement } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import OrderSummaryDetails from "../components/OrderSummary/OrderSummaryDetails";
import OrderProductsList from '../components/OrderProductsList';
import { useGetOrderByIDQuery } from '../order.service';
import { skipToken } from "@reduxjs/toolkit/query";
import { CartFarmerGroupInterface } from '../../cart/cart.interface';
import { OrderItemRequestInterface , OrderDataInterface} from "../order.interface";
import { getCustomerOrderBackgroundColor, mapOrderCustomerStatusToUILabel } from "../../shared/utils/utilsFunctions";

const OrderOverview:FC = ():ReactElement => {
    const params = useParams();
    const navigate = useNavigate();
    const orderID = params.orderID;

    const { data } = useGetOrderByIDQuery(
        orderID ?? skipToken
    );
    const orderData = data?.order;

    const total = Number(data?.order?.total_price) || 0; 
    const shipping = total-2 > 40 ? 0 : 2;
    const taxAmount = (total - shipping) * 0.04; //4%
    const subTotal = total - taxAmount - shipping;

    const mapOrderItemsToProductsList = (item:OrderItemRequestInterface) => {
        return {
            productID: item.product_id,
            name: item.product_name,
            imageUrl: item.product_image_url,
            price: item.unit_price,
            unit: item.product_unit,
            quantity: item.quantity,
            description: item.product_description,
            totalPrice: String(item.total_price),
            favorite: undefined
        }
    }

    const cartData: CartFarmerGroupInterface = {
        farmerID: orderData?.farmer_id,
        farmName: orderData?.farm_name, 
        products: orderData?.orderItems.map(mapOrderItemsToProductsList) ?? []
    } 

    const orderSummaryData: OrderDataInterface = {
        firstName: orderData?.customer_first_name ?? '',
        lastName: orderData?.customer_last_name ?? '',
        address: orderData?.shipping_address.split(",")[0] ?? '',
        city: orderData?.shipping_address.split(",")[1] ?? '',
        postCode: orderData?.shipping_postal_code ?? '',
        phone: orderData?.customer_phone ?? '',
        email: orderData?.customer_email ?? '',
        paymentMethod: orderData?.payment_type ?? null
    }

    const summaryOrderDetailsData = { ... orderSummaryData, total, shipping, taxAmount, subTotal}

    return (
        <div className='w-full max-w-[1000px] mx-auto my-10'>

            <div className=" my-5 px-10 md:px-4 flex flex-col gap-y-4 lg:gap-y-10 ">
                <div className="w-full text-xl flex items-center gap-x-1">
                    <span 
                        className="text-blue-600a font-semibold hover:underline cursor-pointer"
                        onClick={() => navigate(-1)} 
                    >
                        Orders
                    </span>
                    <span className="text-gray-500 font-semibold">{`-->`}</span>
                    <span>View Details</span>
                </div>

                <div className='flex items-center gap-x-6 mb-3'>
                    <div className='text-md font-semibold'>Status:</div>
                    <div className={`
                        py-[.5em] px-3 rounded text-sm font-semibold text-white 
                        xs:px-3 xs:text-sm  
                        ${getCustomerOrderBackgroundColor(orderData?.order_status ?? '')}
                    `}>
                    {mapOrderCustomerStatusToUILabel(orderData?.order_status ?? '')}
                    </div>
                </div>
            
            </div>

            <div className='w-full'>
                <OrderSummaryDetails 
                    {...summaryOrderDetailsData} 
                />
            </div>

            <div className='mt-10 flex justify-center bg-red-300a'>
                <OrderProductsList
                    cartData={cartData}
                    isCheckout={false}
                />
        
            </div>

            <div className='flex w-full justify-center my-6 gap-x-5 text-sm font-lato'>
                <button 
                    className="
                        py-2 px-5 border border-greyB rounded-md bg-gray-300 
                        hover:bg-gray-400 cursor-pointer
                    "
                    onClick={() => navigate(-1)} 
                >
                    Return Back
                </button>
            </div>
        </div>
    )
}

export default OrderOverview;