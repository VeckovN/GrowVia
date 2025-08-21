import { FC, ReactElement } from 'react';
import { OrderChangeStatusInterface } from '../../order/order.interface';
import { OrderStatusType } from '../../order/order.interface';
import { getOrderBackgroundColor, mapOrderStatusToUILabel } from '../../shared/utils/utilsFunctions';

const FarmerOrderChangeStatus:FC<OrderChangeStatusInterface> = ({orderID, orderStatus, onChangeStatus, onClose}):ReactElement => {

    const handleOnChangeStatus = (orderID: string, newStatus: OrderStatusType ) => {
        onChangeStatus(orderID, newStatus);
        onClose();
    }

    return (
        <div className='
            flex flex-col w-full max-w-[450px] mx-auto py-1 px-3 bg-white border-2 border-greyB
            rounded-md
        '>
            <div className='flex justify-between text-sm font-semibold'>
                <div>OrderID: <span className='font-normal'>#{orderID.slice(0,8)}</span></div>
                <div>Status: <span className='font-normal'>{mapOrderStatusToUILabel(orderStatus)}</span></div>
            </div>

            <h3 className='my-6 text-center text-lg font-semibold'> Change Order Status</h3>
            <div className='flex flex-col justify-center items-center gap-y-5 pb-8'>
                <button 
                    className={`
                        w-[80%] p-1 font-medium border rounded-md
                        ${orderStatus === 'processing' 
                            ? `${getOrderBackgroundColor(orderStatus)} text-black cursor-not-allowed opacity-50` 
                            : 'bg-grey border-grayB hover:bg-gray-300 hover:font-semibold cursor-pointer text-black'
                        }
                    `}
                    onClick={() => handleOnChangeStatus(orderID, 'processing')}
                    disabled={orderStatus === 'processing'}
                >
                    Packaged
                </button>
                <button 
                    className={`
                        w-[80%] p-1 font-medium border border-grayB rounded-md
                        ${orderStatus === 'shipped'
                            ? `${getOrderBackgroundColor(orderStatus)} text-black cursor-not-allowed opacity-50`
                            : 'bg-grey hover:bg-gray-300 hover:font-semibold cursor-pointer text-black'
                        }
                    `}
                    onClick={() => handleOnChangeStatus(orderID, 'shipped')}
                    disabled={orderStatus === 'shipped'}
                >
                    To Courier
                </button>
                <button 
                    className={`
                        w-[80%] p-1 font-medium border border-grayB rounded-md
                        ${orderStatus === 'completed'
                            ? `${getOrderBackgroundColor(orderStatus)} text-black cursor-not-allowed opacity-50`
                            : 'bg-grey hover:bg-gray-300 hover:font-semibold cursor-pointer text-black'
                        }
                    `}
                    onClick={() => handleOnChangeStatus(orderID, 'completed')}
                    disabled={orderStatus === 'completed'}
               >
                    Delivered
                </button>
            </div>
        </div>
    )
}

export default FarmerOrderChangeStatus