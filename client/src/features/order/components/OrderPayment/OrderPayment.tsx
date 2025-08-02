import { ChangeEvent, FC, InputHTMLAttributes, ReactElement, useState } from "react";
import { OrderPaymentInterface, CardPaymentDataInterface } from "../../order.interface";
import TextField from "../../../shared/inputs/TextField";

import masterCard from '../../../../assets/paymentCards/Mastercard.svg';
import visaCard from '../../../../assets/paymentCards/Visa.svg';
import cvv from '../../../../assets/paymentCards/cvv.svg';

const OrderPayment:FC<OrderPaymentInterface> = ({paymentData, setPaymentData, validationErrorData, handlePreviousStep, handlePaymentOrderRequest}):ReactElement => {

    const getFieldError = (fieldName: string) => validationErrorData[fieldName];

    const getBorderErrorStyle = (field: string): string =>{
        // if(actionError || getFieldError(field))
        if(getFieldError(field))
            return 'border-0 border-b-4 border-red-400';
        else
            return '';
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>):void => {
         const {name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
       <div className='w-full max-w-[600px] mx-auto my-10'>

            <div className='my-5 md:px-10a flex flex-col gap-y-2'>
                <div className="text-sm flex items-center gap-x-1">
                    <span 
                        className="text-blue-600a font-semibold hover:underline cursor-pointer"
                        onClick={handlePreviousStep} 
                    >
                        Checkout
                    </span>
                    {/* <span className="text-gray-500 font-semibold">→</span> */}
                    <span className="text-gray-500 font-semibold">{`-->`}</span>
                     <span 
                        className="text-blue-600a font-semibold hover:underline cursor-pointer"
                        onClick={handlePreviousStep} 
                    >
                        Summary 
                    </span>
                    <span className="text-gray-500 font-semibold">{`-->`}</span>
                    <span>Payment</span>
                </div>
                <h2 className='text-xl lg:text-2xl font-semibold '>Payment</h2>
            </div>


            <div className='w-full px-5 sm:px-10 py-5 bg-greyOrder border border-greyB rounded-md'>
                <h3 className="sm:text-xl font-semibold mb-3 font-lato">Contact Information</h3>

                <div className="w-full">
                    <label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700">
                        Email
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('email')}
                        `}
                        id="email" 
                        value={paymentData.email}
                        name="email"
                        type="text"
                        placeholder='Enter Email Address'
                        onChange={handleChange}

                    />
                    {validationErrorData.email &&
                        <label className='text-red-600 text-sm'> {validationErrorData.email}</label>
                    }
                </div>

                <h3 className="sm:text-xl font-semibold mt-8 mb-3 font-lato">Payment Details</h3>
                        
                <div className="w-full">
                    <label htmlFor="cardNumber" className="text-sm sm:text-base font-medium text-gray-700">
                        Card Information
                    </label>
                    
                    {validationErrorData.cardNumber &&
                        <div className="mt-1">
                            <label className='text-red-600 text-sm'> {validationErrorData.cardNumber}</label>
                        </div>
                    }

                    <div className='w-full relative'>     
                        <TextField
                            className={`
                                w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-tl-md rounded-tr-md shadow-sm 
                                focus:border-green2 focus:border-4
                                ${getBorderErrorStyle('cardNumber')}
                            `}
                            id="cardNumber" //match label htmlFor 
                            value={paymentData.cardNumber}
                            name="cardNumber"
                            type="number"
                            placeholder='1234-1234-1234-1234'
                            onChange={handleChange}

                        />
                        <img
                            className='absolute right-3 top-1/2 transforma -translate-y-1/2 w-18 h-9 object-contain'
                            src={paymentData.cardType === 'visa' ? visaCard : masterCard}
                            alt={`${paymentData.cardType}`}
                        />

                    </div>
                </div>

                <div className='w-full flex'>
                    <div className="w-1/2">
                        <TextField
                            className={`
                                w-full p-2 pl-4 text-sm sm:text-base border-2a border-l-2 border-b-2 border-r-2 border-greyB rounded-bl-md shadow-sm 
                                focus:border-green2 focus:border-4a
                                ${getBorderErrorStyle('date')}
                            `}
                            id="date" //match label htmlFor 
                            value={paymentData.date}
                            name="date"
                            type="text"
                            placeholder='MM / YY'
                            onChange={handleChange}

                        />
                        {validationErrorData.date &&
                            <label className='text-red-600 text-sm'> {validationErrorData.date}</label>
                        }
                    </div>
                    <div className="w-1/2">
                        <div className="w-full relative">
                            <TextField
                                className={`
                                    w-full p-2 pl-4 text-sm sm:text-base border-b-2 border-r-2 border-greyB rounded-br-md shadow-sm 
                                    focus:border-green2 focus:border-4a
                                    ${getBorderErrorStyle('cvv')}
                                `}
                                id="cvv" //match label htmlFor 
                                value={paymentData.cvv}
                                name="cvv"
                                type="number"
                                placeholder='CVV'
                                onChange={handleChange}
                            />

                            <img
                                className='absolute right-3 top-1/2 transforma -translate-y-1/2 w-18 h-9 object-contain'
                                src={cvv}
                                alt='cvvIcon'
                            />

                        </div>
                        {validationErrorData.cvv &&
                            <label className='text-red-600 text-sm'> {validationErrorData.cvv}</label>
                        }
                    </div>
                </div>
            
                <div className="w-full my-3">
                    <label htmlFor="country" className="text-sm sm:text-base font-medium text-gray-700">
                        Country
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB  rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('country')}
                        `}
                        id="country" //match label htmlFor 
                        value={paymentData.country}
                        name="country"
                        type="text"
                        placeholder='Enter your city'
                        onChange={handleChange}

                    />
                    {validationErrorData.country &&
                        <label className='text-red-600 text-sm'> {validationErrorData.country}</label>
                    }
                </div>

                <div className='w-full flex justify-center pt-5 '>
                    <button 
                        className="
                            py-2 px-10 sm:px-12 font-lato text-white text-base sm:text-lg 
                            border border-blue-700 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer
                        "
                        onClick={handlePaymentOrderRequest}
                    >
                        Pay ${paymentData.total.toFixed(2)}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default OrderPayment