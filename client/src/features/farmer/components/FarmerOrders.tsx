import { ChangeEvent, FC, ReactElement, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppSelector } from '../../../store/store';
import { useAcceptOrderMutation, useCancelOrderMutation, useFinishOrderMutation, useGetOrdersByFarmerIDQuery, useStartDeliveryMutation, useStartProccessMutation } from '../../order/order.service';
import { ReduxStateInterface } from '../../../store/store.interface';
import { OrderFilterOptionsInterface } from '../farmer.interface';
import { OrderDocumentInterface, OrderStatusType, SelectedOrderStatusType } from '../../order/order.interface';
import { mapOrderStatusToUILabel, getOrderBackgroundColor, formatOrderDate } from '../../shared/utils/utilsFunctions';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import SelectField from '../../shared/inputs/SelectField';
import FarmerOrderChangeStatus from './FarmerOrderChangeStatus';
import useOnClickOutside from '../../shared/hooks/useOnClickOutside';
import { getSocket } from '../../../sockets/socket';

const DEFAULT_PROPS: OrderFilterOptionsInterface = {
    sort: 'newest',
    size: 8
}

const FarmerOrders: FC = (): ReactElement => {
    const navigate = useNavigate();
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const farmerID = authUser.id;
    const [orders, setOrders] = useState<OrderDocumentInterface[]>([]);
    const [options, setOptions] = useState<OrderFilterOptionsInterface>({ ...DEFAULT_PROPS });
    const [selectedOrder, setSelectedOrder] = useState<SelectedOrderStatusType | null>(null);
    const changeStatusDropdownRef = useRef<HTMLDivElement>(null);
    const [isChangeStatusOpen, setChangeStatusOpen] = useOnClickOutside(changeStatusDropdownRef, false);

    //another approach 'skipToken' instead of 'skip'
    //Don't fire the query at all if the value 'farmerID' is invalid
    const { data, isLoading } = useGetOrdersByFarmerIDQuery(
        farmerID ?? skipToken
    );
    // const {data:productsData, isLoading:isProductLoading} = useGetProductByFarmerIDQuery({farmerID:id as string, from:0, size:8});
    const [acceptOrder, { isLoading: isAccepted }] = useAcceptOrderMutation();
    const [startProccess] = useStartProccessMutation();
    const [startDelivery] = useStartDeliveryMutation();
    const [finishOrder] = useFinishOrderMutation();
    const [cancelOrder] = useCancelOrderMutation();

    // Keep a local copy of fetched orders for instant UI updates on changes (e.g., status updates)
    // to avoid unnecessary RTK Query refetches.
    useEffect(() => {
        if (data?.orders) {
            setOrders(data.orders);
        }
    }, [data]);

    //When modal is closed by clicking outside(hook related)m also clear selectedOrder
    useEffect(() => {
        if (!isChangeStatusOpen && selectedOrder !== null) {
            setSelectedOrder(null);
        }
    }, [isChangeStatusOpen, selectedOrder])

    useEffect(() => {
        const socket = getSocket();
        if(!socket) return;

        const handleOrderNotification = ({order}: { order: OrderDocumentInterface }) => {
            const orderData: OrderDocumentInterface = order;
            const receiverID = order.farmer_id;
            const currentUserID = String(authUser.id);
            
            if(receiverID === currentUserID ){
                //listen only on "pending"
                if(orderData.order_status !== 'pending')
                    return;

                setOrders(prev => [orderData, ...prev]);
            }
        }

        socket.on('order-notification', handleOrderNotification);

        return () =>{
            //pass samedefined func hanlder to remove the same reference 
            socket.off('order-notification', handleOrderNotification);
        }
    },[]);

    const sizeSelectOptions = [
        { label: 'Show: 8', value: '8' },
        { label: 'Show: 12', value: '12' },
        { label: 'Show: 15', value: '15' }
    ]

    const sortSelectOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Requested Orders', value: 'requested' },
        { label: 'Accepted Orders', value: 'accepted' },
        { label: 'Packaged Orders', value: 'packaged' },
        { label: 'To Courier', value: 'toCurier' },
        { label: 'Delivered Orders', value: 'delivered' },
        { label: 'Canceled Orders', value: 'canceled' },
    ]

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setOptions(prev => ({
            ...prev,
            [name]: name === 'size' ? Number(value) : value
        }))
    }

    // Mapping backend order_status values to user-friendly UI labels:
    // Backend status       -> UI display label

    // 'pending' -> 'requested'
    // 'accepted' -> 'accepted'
    // 'rejected' or 'cancel' -> 'canceled'
    // 'processing' -> 'packaged'
    // 'shipped' -> 'To Courier'
    // 'completed' -> 'delivered'

    const openChangeStatusModal = (orderID: string, orderStatus: string): void => {
        setSelectedOrder({ orderID, orderStatus });
        setChangeStatusOpen(true);
    }

    const handleChangeStatus = async (orderID: string, newStatus: OrderStatusType): Promise<void> => {
        try {
            let result;

            switch (newStatus) {
                case 'accepted':
                    result = await acceptOrder(orderID);
                    break;
                case 'canceled':
                    result = await cancelOrder(orderID);
                    break;
                // case 'packaged':
                case 'processing':
                    result = await startProccess(orderID);
                    break;
                // case 'toCourier':
                case 'shipped':
                    result = await startDelivery(orderID);
                    break;
                // case 'delivered':
                case 'completed':
                    result = await finishOrder(orderID);
                    break;
                default:
                    console.warn('Unknown status:', newStatus);
            }

            const resultMessage = result?.data.message;
            toast.success(resultMessage ?? `Your new order status: ${newStatus}`);

            //update local orders (without re-fetching RTQ)
            setOrders(prev =>
                prev.map(order =>
                    order.order_id === orderID
                        ? { ...order, order_status: newStatus }
                        : order
                )
            )

        } catch (err) {
            console.error('Error changing status:', err);
            toast.error("Error on accept order change status")
        }
    };


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
        <div className='w-full'>
            <h3 className='hidden sm:block text-xl font-medium ml-3 '>
                Orders
            </h3>

            <div className='mt-5'>
                <div className='w-full flex justify-end gap-x-4'>
                    <SelectField
                        className={`max-w-[8em] p-[12px] text-start bg-white text-gray-500 rounded-xl`}
                        id='size'
                        name='size'
                        value={options.size?.toString() || ''}
                        options={sizeSelectOptions}
                        onChange={handleSelectChange}
                    />
                    <SelectField
                        className={`p-[12px] max-w-[13em] pl-4a bg-white text-gray-500 rounded-xl`}
                        id='sort'
                        name='sort'
                        value={options.sort || ''}
                        options={sortSelectOptions}
                        onChange={handleSelectChange}
                    />
                </div>
            </div>

            <div className='mt-8 w-full'>
                {orders.length === 0 ? (
                    <div className='text-center text-lg lg:text-xl text-gray-500 py-16'>
                        You have no orders yet.
                    </div>
                ) : (
                orders.map((order) => (
                    <div
                        key={order.order_id}
                        className={`
                            flex flex-col relative md:flex-row max-w-[800px] mx-auto px-2 py-3 mb-6 border-2 border-greyB  rounded-md
                            ${getOrderBackgroundColor(order.order_status)}     
                        `}
                    >
                        {isChangeStatusOpen && selectedOrder?.orderID === order.order_id &&
                            <div
                                ref={changeStatusDropdownRef}
                                className='
                                    w-full z-50 w-[110%] absolute max-w-[420px] mx-auto 
                                    xs:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 
                                '
                            >
                                <FarmerOrderChangeStatus
                                    orderID={selectedOrder.orderID}
                                    orderStatus={selectedOrder.orderStatus}
                                    onChangeStatus={handleChangeStatus}
                                    onClose={() => setSelectedOrder(null)}
                                />
                            </div>
                        }


                        <div className='w-full flex flex-col gap-y-2 xs:text-sm sm:text-base'>

                            <div className='flex w-full flex-col pl-5 xs:pl-3 xs:flex-row gap-x-3 gap-y-2'>
                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato'>
                                    <div className="font-semibold ">
                                        Status:
                                    </div>
                                    <div>
                                        {mapOrderStatusToUILabel(order.order_status)}
                                    </div>
                                </div>

                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato '>
                                    <div className="font-semibold">
                                        OrderID:
                                    </div>
                                    <div>
                                        #{order.order_id.slice(0, 8)}
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col pl-5 xs:pl-3 xs:flex-row gap-x-2 gap-y-2'>
                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato'>
                                    <div className="font-semibold">
                                        Address:
                                    </div>
                                    <div>
                                        {order.shipping_address}
                                    </div>
                                </div>

                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato w-1/2'>
                                    <div className="font-semibold">
                                        Customer:
                                    </div>
                                    <div>
                                        {`${order.customer_first_name} ${order.customer_last_name}`}
                                    </div>
                                </div>
                            </div>

                            <div className='flex w-full flex-col pl-5 xs:pl-3 xs:flex-row gap-x-2 gap-y-2'>
                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato '>
                                    <div className="font-semibold">
                                        Date:
                                    </div>
                                    <div>
                                        {formatOrderDate(order.created_at)}
                                    </div>
                                </div>

                                <div className='flex w-full xs:w-1/2 gap-x-2 font-lato '>
                                    <div className="font-semibold">
                                        TotalPrice:
                                    </div>
                                    <div>
                                        ${order.total_price}
                                    </div>
                                </div>
                            </div>

                            <div className='flex f w-full flex-col pl-5 xs:pl-3 xs:flex-row gap-x-2 gap-y-2'>
                                <div className='flex w-full xs:w-1/2  gap-x-2 font-lato '>
                                    <div className="font-semibold">
                                        PaymentType:
                                    </div>
                                    <div>
                                        {order.payment_type}
                                    </div>
                                </div>

                                {order?.payment_type === 'stripe' &&
                                    <div className='flex w-full xs:w-1/2 gap-x-2 font-lato '>
                                        <div className="font-semibold">
                                            Payment Status:
                                        </div>
                                        <div>
                                            {order?.payment_status}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='
                            flex w-full flex-col md:w-1/2 xs:flex-row gap-x-4 items-center justify-center gap-y-2 mt-3 my-2 
                            md:mt-0 md:flex-col md:w-[30%]a md:max-w-[140px] 
                        '>
                            {order.order_status === 'pending'
                                ?
                                <div className='xs:w-full xs:pl-3 md:pl-0 text-sm md:justify-between'>
                                    <button
                                        className='
                                            bg-green-800 text-white text-md p-[.3em] px-2 rounded-md 
                                            hover:bg-green-700 
                                        '
                                        onClick={() => handleChangeStatus(order.order_id, 'accepted')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className='
                                            ml-3 bg-red-700 text-white  p-[.3em] px-2 rounded-md
                                            hover:bg-red-600 
                                        '
                                        onClick={() => handleChangeStatus(order.order_id, 'canceled')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                :
                                <div className='xs:w-full xs:pl-3 md:pl-0'>
                                    <button
                                        className={`
                                            bg-white text-sm font-semibold p-[.4em] px-4 border-2 border-greyB rounded-md hover:bg-gray-200
                                            ${selectedOrder?.orderID === order.order_id && '!bg-gray-500 text-white'} 
                                        `}
                                        //use '!bg-grey-100' to override default 'bg-white' or use ternary operator (e.g.  ? 'bg-gray-500 : 'bg-white' )
                                        onClick={() => openChangeStatusModal(order.order_id, order.order_status)}
                                    >
                                        Change status
                                    </button>
                                </div>
                            }
                            <div className='xs:w-full'>
                                <button
                                    className='bg-white text-sm font-semibold p-[.4em] px-6 border-2 border-greyB rounded-md hover:bg-gray-200'
                                    onClick={() => navigate(`/order/overview/${order.order_id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>

                    </div>
                
                )) 
            )}
            </div>

        </div>
    )
}

export default FarmerOrders;