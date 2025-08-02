import { ChangeEvent, FC, ReactElement } from "react";
import { OrderCheckoutInterface, PaymentType } from "../../order.interface";

import DeliveryDetailsForm from "./DeliveryDetailsForm";
import DeliveryCardOptions from "./DeliveryCardOptions";
import DeliveryOrderSummary from "./DeliveryOrderSummary";
import OrderProductsList from "../OrderProductsList";

const OrderCheckout:FC<OrderCheckoutInterface> = ({orderData, cartData, setOrderData, validationErrorData, priceDetails, handleNextStep}):ReactElement => {
    
    console.log("validationErrorData", validationErrorData);

    const onInputChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>):void => {
        const {name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onSelectPaymentMethod = (method: PaymentType) => {
        console.log("method: ", method)
        setOrderData(prev => ({...prev, paymentMethod:method}))
    }
   
    return (
        <div className='w-full my-10'>
            <h2 className='text-xl lg:text-2xl font-semibold my-5 md:px-10'> Checkout</h2>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-5 lg:flex-row justify-center items-center lg:items-start'>
                    <DeliveryDetailsForm
                        orderData={orderData}
                        validationErrorData={validationErrorData}
                        handleChange={onInputChange}
                    />

                    <div className='w-full gap-5 flex flex-col justify-center items-center'>
                        <DeliveryCardOptions
                            onPaymentSelect={onSelectPaymentMethod}
                            validationError={validationErrorData.paymentMethod}
                            paymentOption={orderData.paymentMethod}
                        />
                        {/* IN THIS COMPOENNT IUS BUTTON FOR GOING TO STEP 2  */}
                        <DeliveryOrderSummary
                            priceDetails={priceDetails}
                            handleNextStep={handleNextStep}
                        />
                    </div>
                </div>

                <div className='w-full flex justify-center my-10'>
                    <OrderProductsList
                        cartData={cartData}
                        isCheckout={true}//dispay farerName and freeShipping message
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderCheckout