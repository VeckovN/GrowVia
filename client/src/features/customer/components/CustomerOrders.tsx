import { FC, ReactElement, useState, useEffect, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';
import { useCancelOrderMutation } from '../../order/order.service';
import { useGetOrdersByCustomerIDQuery } from '../../order/order.service';
import { ReduxStateInterface } from '../../../store/store.interface';
import { OrderDocumentInterface } from '../../order/order.interface';
import { mapOrderCustomerStatusToUILabel, getCustomerOrderBackgroundColor, formatOrderDate } from '../../shared/utils/utilsFunctions';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import SelectField from '../../shared/inputs/SelectField';

import DownloadIcon from '../../../assets/download.svg';

const CustomerOrders:FC = ():ReactElement => {
    const navigate = useNavigate();
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const customerID = authUser.id;

    const [orders, setOrders] = useState<OrderDocumentInterface[]>([]);
    const [sort, setSort] = useState<string>('newest');


    const { data, isLoading } = useGetOrdersByCustomerIDQuery(
        customerID ?? skipToken
    );

    const [cancelOrder] = useCancelOrderMutation();

    useEffect(() => {
        if (data?.orders) {
            setOrders(data.orders);
        }
    }, [data]);

    console.log("customer orders: ", orders);
    
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
                <div className="text-xl font-semibold">
                    <LoadingSpinner spinnerClassName='text-gray-800' />
                </div>
            </div>
        );
    }

    //Mapping backend order_status values to user-friendly UI labels:
    // 'pending' -> 'Requested'
    // 'accepted' -> 'In Progress'
    // 'processing' -> 'In Progress'
    // 'shipped' -> 'In Progress'
    // 'completed' -> 'Delivered'
    // 'rejected' or 'cancel' -> 'canceled'

    const sortSelectOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Requested', value: 'requested' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Canceled ', value: 'canceled' },
    ]

    const onCancelRequestedOrder = async(orderID: string):Promise<void> => {
        try{    
            const result = await cancelOrder(orderID);
    
            const resultMessage = result?.data?.message;
            toast.success(resultMessage ?? `Order successfully canceled`);

            setOrders(prev =>
                prev.map(order =>
                    order.order_id === orderID
                        ? { ...order, order_status: 'canceled' }
                        : order
                )
            )
            //Socket - notify farmer on Cancel order
        } 
        catch(err){
            console.error('Error changing status:', err);
            toast.error("Error on cancel order")
        }
    }

    return (
        <div className='w-full'>
            <h3 className='hidden sm:block text-xl font-medium ml-3 '>
                Orders
            </h3>

            <div className='mt-5 w-full max-w-[800px] mx-auto'>
                <div className='w-full flex justify-end gap-x-4'>
                    <SelectField
                        className={`p-[12px] max-w-[11em] pl-4a bg-white text-gray-500 rounded-xl`}
                        id='sort'
                        name='sort'
                        value={sort || ''}
                        options={sortSelectOptions}
                        onChange={(e:ChangeEvent<HTMLSelectElement>) => setSort((e.target.value))}
                    />
                </div>
            </div>

            <div className='mt-8 w-full'>

                {orders.map(order => (
                    <div className='flex flex-col text-sm xs:text-base font-lato max-w-[800px] mx-auto gap-y-2 px-2 sm:px-4 py-3 mb-6 border border-greyB rounded-md'>

                        <div className='flex justify-between text-gray-600 font-light'>
                            <div>OrderID: <span className='font-semibold text-black'>#{order.order_id.slice(0,8)}</span></div>
                            <div className='flex items-center gap-x-2 cursor-pointer hover:border-b hover:border-greyB '>
                                <img 
                                    className='w-3'
                                    src={DownloadIcon}
                                    alt='downloadIcon'
                                />
                                <div className='text-sm sm:text-base'> Download Invoice</div>
                            </div>
                        </div>

                        <div className='py-2 sm:px-6 md:px-0 flex flex-cola xs:flex-row gap-x-3 xs:gap-x-4 border-b items-center '>
                            <div className={`
                                    py-[.5em] px-3 rounded text-xs font-semibold text-white 
                                    xs:px-3 xs:text-sm  
                                    ${getCustomerOrderBackgroundColor(order.order_status)}
                                `}>
                                {mapOrderCustomerStatusToUILabel(order.order_status)}
                            </div>

                            <div className='
                                flex flex-col font-medium border-greyB  gap-y-2 
                                md:flex-row md:gap-x-4 
                            '>
                                <div className='border-l-2 border-greyB pl-2' >Order Date: <span className='font-light'>{formatOrderDate(order.created_at)}</span> </div>
                                <div className='border-l-2 border-greyB pl-2 md:pl-0 md:border-0 '>Farmer: <span className='font-light'>--farmerName---</span> </div>
                            </div>
                        </div>

                        <div className='py-1 flex flex-col xs:flex-row sm:justify-between'>
                            <div className='flex justify-center xs:justify-none gap-x-3 xs:gap-x-3a sm:gap-x-5  '>
                                <button 
                                    className='
                                        py-2 px-5 xs:px-6 sm:px-10 text-xs xs:text-sm font-medium border border-grey rounded
                                        hover:bg-gray-100
                                    '
                                    onClick={() => navigate(`/order/track/${order.order_id}`)}
                                >
                                    Track Order
                                </button>
                                <button 
                                    className='
                                        py-2 px-5 xs:px-6 sm:px-10 text-xs xs:text-sm font-medium border border-grey rounded
                                        hover:bg-gray-100
                                    '
                                    onClick={() => navigate(`/order/overview/${order.order_id}`)}
                                >
                                    Order Details
                                </button>
                            </div>

                            <div className='flex justify-center mt-3 xs:mt-0  xs:px-3'>
                                 <button 
                                    className={`
                                        py-2 px-8 sm:px-12 text-xs xs:text-sm font-medium  text-white rounded
                                        ${order.order_status === 'pending' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-900 opacity-80 cursor-not-allowed '}
                                    `}
                                    onClick={() => onCancelRequestedOrder(order.order_id)}
                                    disabled={order.order_status !== 'pending'}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </div>
                )) }
            </div>

        </div>
    )
}

export default CustomerOrders