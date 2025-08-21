import { FC, ReactElement } from 'react';
import { DeliveryOrderSummaryPropsInterface } from '../../order.interface'; 

const DeliveryOrderSummary:FC<DeliveryOrderSummaryPropsInterface> = ({priceDetails, handleNextStep}):ReactElement => {
    
    return (
        <div className='w-full max-w-[412px] pt-2 pb-2 px-4  border-2 border-greyB bg-greyOrder rounded'>
            <h3 className="text-lg font-semibold font-lato"> Order Summary</h3>

            <div className='px-2 py-4 w-full flex flex-col  font-lato'>
                <div className='flex justify-between'>
                    <label>Sub Total</label>
                    <label className='text-lg'>${priceDetails.subTotal}</label>
                </div>

                <div className='flex justify-between'>
                    <label>Shipping</label>
                    <label className='text-lg'>{priceDetails.shipping === 0 ? "Free" : `$${priceDetails.shipping}`}</label>
                </div>
                <div className='flex justify-between'>
                    <label>{`Tax (4%)`}</label>
                    <label className='text-lg'>${priceDetails.taxAmount.toFixed(2)}</label>
                </div>

                <div className='border-t mt-2 py-1 border-greyB flex justify-between'>
                    <label className='font-semibold text-lg'>Total</label>
                    <label className='font-semibold text-lg'>${priceDetails.total.toFixed(2)}</label>
                </div>
            </div>

            <div className='w-full flex justify-center'>
                <button
                    className='
                        p-2 px-4 bg-blue-500 text-white text-sm font-lato rounded
                        hover:bg-blue-600 cursor-pointer
                    '
                    onClick={handleNextStep}
                >
                    Continue With Order 
                </button>
            </div>

        </div>
    )
}

export default DeliveryOrderSummary