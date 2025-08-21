import { FC, ReactElement } from "react"
import { OrderStatusTimeLineProps } from "../../order.interface";

//Svgs imported as React Component
import RequestedIcon from '../../../../assets/orderTrack/Requested.svg?react';
import AcceptedIcon from '../../../../assets/orderTrack/Accepted.svg?react';
import PackagedIcon from '../../../../assets/orderTrack/Packaged.svg?react';
import ToCourierIcon from '../../../../assets/orderTrack/ToCourier.svg?react';
import DeliveredIcon from '../../../../assets/orderTrack/Delivered.svg?react';

const OrderStatusTimeLine:FC<OrderStatusTimeLineProps> = ({currentStatus}):ReactElement => {

    console.log("curre: ", currentStatus);

    const statuses = [
        { key: 'Requested', label:"Order Requested", Icon: RequestedIcon  },
        { key: 'Accepted', label:"Farmer Accepted", Icon: AcceptedIcon },
        { key: 'Packaged', label:"Order Procesed and packed", Icon: PackagedIcon },
        { key: 'To Courier', label:"Order Delivered to  the courier", Icon: ToCourierIcon },
        { key: 'Delivered', label:"Order Delivered", Icon: DeliveredIcon }
    ];

    const currentIndex = statuses.findIndex(s => s.key === currentStatus);

    return (
        <div className='flex flex-col gap-y-3'>
            <div className='flex gap-x-3 '>
                
                {statuses.map((status, index) => {
                    const Icon = status.Icon; //React SVG compoenent from statuses 
                    const isCompleted = index <= currentIndex;
                    return (
                        <div 
                            key={status.key}
                            className='flex-1 flex justify-center relative z-10 '    
                        >
                            <Icon
                                className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-autoa ${
                                    currentStatus === "Canceled"
                                        ? "[&_*]:fill-red-400"
                                        : isCompleted
                                        ? "[&_*]:fill-green-500"
                                        : "[&_*]:fill-gray-800"
                                }`}
                            />
                        
                        </div>
                    )
                })}
            </div>

            <div className="relative w-full">
                {/* Full gray line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2"></div>
                
                {/* Green progress line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-600"
                    style={{ 
                        width: currentIndex === statuses.length - 1
                            ? '100%'
                            : `calc(${(currentIndex + 0.5) / statuses.length * 100}%)`
                    }}
                ></div>

                {currentStatus === "Canceled" && (
                    <div className="absolute w-full top-1/2 left-0 h-1 bg-red-500 -translate-y-1/2 transition-all duration-600 z-20"/>
                )}
                
                <div className="absolute w-full flex -translate-y-1/2 z-10">
                    {statuses.map((status, index) => {
                        const isCompleted = index <= currentIndex;
                        
                        return (
                            <div
                                key={`circle-${status.key}`}
                                className='flex flex-1 justify-center'
                            >
                                <div
                                    className={`relative w-2 h-2 flexa justify-centera  rounded-full ${
                                        // isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                                        currentStatus === "Canceled" 
                                            ? 'bg-red-500' 
                                            : isCompleted 
                                            ? 'bg-green-600' 
                                            : 'bg-gray-300'}
                                    `}
                                >
                                    <div className='absolute h-1 w-1 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='flex text-xs xs:text-sm lg:text-base font-lato'>
                {statuses.map((status, index) => { 
                    const isCompleted = index <= currentIndex;
                    return (
                        <div 
                            key={`details-${status.key}`}
                            className='flex flex-1 justify-center text-center relative z-10 bg-red-800a'    
                        >
                            <div 
                                className={` bg-red-100a flex flex-col items-center ${
                                    currentStatus === "Canceled" 
                                        ? 'text-red-400' 
                                        : isCompleted 
                                        ? 'text-green-500' 
                                        : 'text-gray-800'
                                }`}
                            >
                                <div className='leading-tight'>{status.label}</div>
                                {/* <p>{formatOrderDate(order.created_at)}</p> */}
                                <p className='text-xs'>May 15th, 2025</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div> 
    )
}

export default OrderStatusTimeLine