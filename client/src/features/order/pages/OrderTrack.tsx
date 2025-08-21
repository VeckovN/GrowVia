import { FC, ReactElement, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderByIDQuery } from '../order.service';
import { formatOrderDate, mapOrderCustomerStatusToUILabel, mapOrderStatusToUILabel } from '../../shared/utils/utilsFunctions';
import { skipToken } from '@reduxjs/toolkit/query';
import { OrderDocumentInterface } from '../order.interface';

import LoadingSpinner from '../../shared/page/LoadingSpinner';
import OrderStatusTimeLine from '../components/OrderTrack/OrderStatusTimeLine';
import OrderItemsList from '../components/OrderTrack/OrderItemsList';
import OrderTrackSummaryCard from '../components/OrderTrack/OrderTrackSummaryCard';

const OrderTrack:FC = ():ReactElement => {
    const params = useParams();
    const navigate = useNavigate();
    const orderID = params.orderID;


    //get order by orderID;
    const { data, isLoading } = useGetOrderByIDQuery(
        orderID ?? skipToken
    );

    //only reason why i use useState for storing order isntead of directly read data.order from RTQ response
    //because the order will be changed on socket listener (when farmer change status)
    const [order, setOrders] = useState<OrderDocumentInterface | null>(null);
    
    useEffect(() => {
        if(data?.order) { //this is equeal to !isLoading
            setOrders(data.order);
        }
    }, [data]);

    console.log("DATAAA: ", order);

    // const currentStatus = order?.order_status  ?? 'Requested'; 
    const currentStatus = mapOrderStatusToUILabel(order?.order_status as string) ?? 'Requested'; 

    // useEffect(() => {
    //     socket.on("orderStatusChanged", (newStatus: string) => {
    //         setOrder(prev => prev ? { ...prev, order_status: newStatus } : prev);
    //     });
        
    //     return () => {
    //         socket.off("orderStatusChanged");
    //     };
    // }, []); 

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
                <div className="text-xl font-semibold">
                    <LoadingSpinner spinnerClassName='text-gray-800' />
                </div>
            </div>
        );
    }
    return (
        <div className='w-full px-4 sm:px-8 lg:px-10'>
            
            <div 
                className='mt-4 font-lato text-sm hover:underline cursor-pointer'
                onClick={() => navigate(-1)}
            >
                    
                {`<`} <span>Back to all orders</span>
            </div>

            <div className='mt-5 flex flex-col items-center sm:items-start gap-y-2'>
                <h2 className='font-semibold text-lg sm:text-xl'> Track Delivery</h2>
            
                <div className='leading-tight'>
                    <p>OrderNumber</p>
                    <p>#{order?.order_id.slice(0, 8)}</p>
                </div>
            </div>

            <div className='mt-12 sm:mt-20'>
                <OrderStatusTimeLine 
                    currentStatus={currentStatus}
                />
            </div>

            <div className='mt-20 sm:mt-32 mb-40 w-full flex flex-col md:flex-row items-center md:items-start gap-y-4 gap-x-3'>

                <div className='w-full order-2 md:order-1'>
                    <OrderItemsList 
                        orderItems={order?.orderItems ?? []}
                    />
                </div>

                <div className='w-full order-1 md:w-auto md:w-[500px]'>
                    <OrderTrackSummaryCard 
                        order={order}
                    />
                </div>
                
            </div>
            
        </div>
    )
}

export default OrderTrack

