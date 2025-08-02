import { FC, ReactElement } from 'react';
import { DeliveryCardOptionsPropsInterface } from '../../order.interface';
import visaCardIcon from '../../../../assets/paymentCards/VisaNoBorder.svg';
import masterCardIcon from '../../../../assets/paymentCards/MastercardNoBorder.svg';
 
const DeliveryCardOptions:FC<DeliveryCardOptionsPropsInterface> = ({paymentOption, validationError, onPaymentSelect}):ReactElement => {
    
    return (
        <div className='w-full max-w-[412px] pt-2 pb-5 px-4 sm:px-6 border-2 border-greyB bg-greyOrder rounded'>
            <h3 className="text-lg font-semibold font-lato">Payment Methods</h3>
            <div className='pt-6 flex flex-rows justify-around'>
                <div 
                    className={`
                        flex justify-center items-center w-[4.5rem] h-11 cursor-pointer 
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

                <div className='relative flex gap-x-4 sm:gap-x-6 md:gap-x-8'>
                    <label 
                        className='
                            absolute top-[-1.5em] w-full flex justify-center items-center 
                            font-poppins text-sm text-greyB'
                        >
                        Credit cards
                    </label>

                    <div 
                        className={`
                            w-[4.5rem] h-11 border-2 border-greyB rounded-md 
                            hover:bg-white  hover:border-4 cursor-pointer
                            ${paymentOption === 'visa' && 'border-4 border-gray-700'}
                            ${validationError && 'border-red-500 hover:border-greyB'}
                        `}
                        onClick={() => onPaymentSelect('visa')}
                    >
                        <img
                            className='w-full h-full'
                            src={visaCardIcon}
                            alt='visaCard'
                        />
                    </div>
                    <div 
                        className={`
                            w-[4.5rem] h-11 border-2 border-greyB rounded-md 
                            hover:bg-white  hover:border-4 cursor-pointer
                            ${paymentOption === 'master' && 'border-4 border-gray-700'}
                            ${validationError && 'border-red-500 hover:border-greyB'}
                        `}
                        onClick={() => onPaymentSelect('master')}
                    >
                        <img
                            className='w-full h-full'
                            src={masterCardIcon}
                            alt='masterCard'
                        />
                    </div>
                </div>  
            </div>
            <div className='flex justify-center mt-3'>
                {validationError &&
                    <label className='text-red-600 text-sm'> {validationError}</label>
                }  
            </div>
        </div>
    )
}

export default DeliveryCardOptions