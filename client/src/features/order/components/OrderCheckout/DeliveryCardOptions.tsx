import { FC, ReactElement } from 'react';
import { DeliveryCardOptionsPropsInterface } from '../../order.interface';
import stripeCardIcon from '../../../../assets/paymentCards/Stripe.svg';
 
const DeliveryCardOptions:FC<DeliveryCardOptionsPropsInterface> = ({paymentOption, validationError, onPaymentSelect}):ReactElement => {
    
    return (
        <div className='w-full max-w-[412px] pt-2 pb-1 px-4 sm:px-6 border-2 border-greyB bg-greyOrder rounded'>
            <h3 className="text-lg font-semibold font-lato text-center">Payment Methods</h3>
            <div className='pt-5 flex flex-rows justify-around'>

                <div className='flex flex-col justify-center items-center'>
                    <h4 className='text-gray-700'>Cash on delivery</h4>
                    <div 
                        className={`
                            flex justify-center items-center w-[4.3rem] h-[3rem] mt-2 cursor-pointer 
                            border-2 border-greyB rounded-md hover:bg-white hover:border-4 group
                            ${paymentOption === 'cod' && 'border-4 border-gray-700'}
                            ${validationError && 'border-red-500 hover:border-greyB'}
                        `}
                        onClick={() => onPaymentSelect('cod')}
                    >
                        <label className='text-greyB font-semibold group-hover:text-sm cursor-pointer'> 
                            COD
                        </label>
                    </div>
                </div>
                
                <div className='flex flex-col justify-center items-center'>
                    <h4 className='text-gray-700'>Credit card</h4>
                    <div 
                        className={`
                            flex justify-center items-center w-[4.3rem] h-[3rem] mt-2 cursor-pointer 
                            border-2 border-greyB rounded-md hover:bg-white hover:border-4 group
                            ${paymentOption === 'stripe' && 'border-4 border-gray-700'}
                            ${validationError && 'border-red-500 hover:border-greyB'}
                        `}
                        onClick={() => onPaymentSelect('stripe')}
                    >
                        <img
                            className='w-full h-full'
                            src={stripeCardIcon}
                            alt='stripe'
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-center my-2'>
                {validationError &&
                    <label className='text-red-600 text-sm'> {validationError}</label>
                }  
            </div>
        </div>
    )
}

export default DeliveryCardOptions