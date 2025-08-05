import { ChangeEvent, FC, ReactElement, useState} from "react";
import toast from 'react-hot-toast';
import { OrderPaymentInterface } from "../../order.interface";
import TextField from "../../../shared/inputs/TextField";
import { useStripe, useElements,  CardNumberElement, CardExpiryElement, CardCvcElement, } from "@stripe/react-stripe-js";
import cvv from '../../../../assets/paymentCards/cvv.svg';

const OrderPayment:FC<OrderPaymentInterface> = ({paymentData, setPaymentData, validationErrorData, handlePreviousStep, handlePaymentOrderRequest}):ReactElement => {

    const stripe = useStripe();
    const elements = useElements();

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

    const onPayment = async():Promise<void> => {
        try{
            if(!stripe || !elements) return;

            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) return;

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
                billing_details: {
                    email: paymentData.email,
                    // address: { country: paymentData.country}
                },
            });

            console.log("PaymentMethod, ", paymentMethod);

            if(error){
                console.log("Stripe Payment Error: ", error);
                toast.error(`Stripe Error: ${error.message}`);
                return;
            }

            setPaymentData(prev => ({...prev, paymentMethodID: paymentMethod.id}))
            
            //race condition because setPaymentData(...) is asynchronous and does not immediately update the paymentData value
            // that’s being read right afterward by handlePaymentOrderRequest().
            //So put paymentMethod.id directly to func
            handlePaymentOrderRequest(paymentMethod.id);
        }
        catch(err){

        }
    }

    const cardElementOptions = {
        style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
            color: '#aab7c4',
            },
        },
        invalid: {
            color: '#db3840ff',
        },
        },
    };
    

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
        
                     <div className="relative border-2 border-greyB rounded-t-md p-2 py-3">
                        <CardNumberElement options={cardElementOptions} />
                       
                    </div>
                </div>

                <div className='w-full flex'>
                    <div className="w-1/2">
                        <div className="border-2 border-greyB border-r-0 rounded-bl-md p-2 py-3">
                            <CardExpiryElement options={cardElementOptions} />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="w-full relative">
                             <div className="relative border-2 border-greyB rounded-br-md p-2 py-3">
                                <CardCvcElement options={cardElementOptions} />
                                <img
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6"
                                    src={cvv}
                                    alt="CVV"
                                />
                            </div>
                        </div>
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
                        onClick={onPayment}
                    >
                        Pay ${paymentData.total.toFixed(2)}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default OrderPayment