import { FC, ReactElement } from "react";
import { OrderProductsListPropsInterface } from "../order.interface";

const OrderProductsList:FC<OrderProductsListPropsInterface> = ({cartData, isCheckout=false}):ReactElement => {
    return (
        <div className='w-full max-w-[840px] flex flex-col bg-greyOrder border border-greyB rounded-md'>
            {isCheckout &&
            <div className="px-2 sm:px-4 py-2 flex flex-col sm:flex-row justify-between">
                <label>From Farmer: <span className='font-semibold'>{cartData.farmName}</span></label>
                <label>Free Shipping for order over $40</label>
            </div>
            }
   
            {cartData.products.map(prod => (
                <div 
                    className='px-2 sm:px-2 md:px-4 py-2 w-full flex flex-col sm:flex-row border-t border-greyB' 
                    key={prod.productID}
                >   
                    <div className='flex sm:gap-x-2 md:gap-x-4'>
                        <img 
                            className='w-full max-w-[160px] h-[90px] min-w-[130px] max-h-[100px] rounded-md object-cover'
                            src={prod.imageUrl}
                        />

                        <div className='w-full flex flex-col sm:flex-row'>
                            <div className='flex flex-col items-center sm:items-start font-medium'>
                                <label className='pt-4 sm:pt-0 text-lg sm:text-base'>{prod.name}</label>
                                <p className='hidden sm:block text-gray-600'>
                                   {prod.description ? prod.description : "No descriptions"}
                                </p>
                            </div>

                            <div className='flex justify-center items-center gap-x-2 sm:w-52 text-lg sm:text-base'>
                                <div className='font-medium'>{prod.quantity} {prod.unit === 'piece' ? 'pc' : prod.unit}</div>
                                <div className='font-medium'>${prod.price} </div>
                            </div>
                        </div>
                    </div>

                    <div className='sm:hidden mt-2 text-gray-600'>
                        {prod.description ? prod.description : "No descriptions"}
                    </div>
                </div>  
            ))}
        </div>
    )
}

export default OrderProductsList