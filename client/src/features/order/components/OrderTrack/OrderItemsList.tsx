import { FC, ReactElement } from "react"
import { OrderItemsListPropsInterface} from "../../order.interface"

const OrderItemsList:FC<OrderItemsListPropsInterface> = ({orderItems}):ReactElement => {
    return (
        <div className='w-full max-w-[840px]a flex flex-col  bg-greyOrder border border-greyB rounded-md'>

            {orderItems.map(prod => (
                <div 
                    className='px-2  sm:px-2 md:px-4 py-2 w-full flex flex-col sm:flex-row border-t border-greyB' 
                    key={prod.product_id}
                >   
                    <div className='w-full flex justify-between sm:gap-x-2 md:gap-x-4 text-sm xs:text-base'>
                        <div className='flex'>
                            <img
                                //flex-shrink-0 to prevent image from shrinking in small screens
                                className='flex-shrink-0 w-[120px] md:w-[140px] h-[90px] rounded-md object-cover'
                                src={prod.product_image_url}
                            />
                            <div className='w-full flex flex-col items-centera justify-center  ml-5 font-medium'>
                                {/* <label className='pt-4 sm:pt-0 text-lg sm:text-base'>{prod.name}</label> */}
                                <label className='pt-4 sm:pt-0 '>{prod.product_name}</label>
                                <label className="text-gray-400 text-xs sm:text-sm font-light">Unit: {prod.product_unit}</label>
                            </div>
                        </div>

                        <div className='flex justify-between items-center bg-red-100a gap-x-2 xs:gap-x-4 sm:gap-x-10 sm:w-52a'>
                            <div className='font-medium'>x{prod.quantity} </div>
                            <div className='font-medium'>${prod.total_price} </div>
                        </div>
                        
                    </div>
                </div>  
            ))}
        </div>
    )
}

export default OrderItemsList