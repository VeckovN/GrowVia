import { FC, ReactElement } from "react";
import { OrderSummaryInterface } from "../../order.interface";
import OrderProductsList from "../OrderProductsList";
import OrderSummaryDetails from "./OrderSummaryDetails";

const OrderSummary:FC<OrderSummaryInterface> = ({orderData, priceDetails, cartData, handleNextStep, handlePreviousStep}):ReactElement => {

    const summaryOrderDetailsData = {...orderData, ...priceDetails}

    return (
        <div className='w-full max-w-[1000px] mx-auto my-10'>

            <div className="my-5 md:px-10 flex flex-col gap-y-2">
                <div className="text-sm  flex items-center gap-x-1">
                    <span 
                        className="text-blue-600a font-semibold hover:underline cursor-pointer"
                        onClick={handlePreviousStep} 
                    >
                        Checkout
                    </span>
                    <span className="text-gray-500 font-semibold">{`-->`}</span>
                    <span>Summary</span>
                </div>
                
                <h2 className="text-xl lg:text-2xl font-semibold">Summary</h2>
            </div>

            <div className='w-full'>
                <OrderSummaryDetails 
                    {...summaryOrderDetailsData} 
                />
            </div>

            <div className='mt-5 flex justify-center bg-red-300a'>
                <OrderProductsList
                    cartData={cartData}
                    isCheckout={false}
                />
        
            </div>


            <div className='flex w-full justify-center my-6 gap-x-5 text-sm font-lato'>
                <button 
                    className="
                        py-2 px-5 border border-greyB rounded-md bg-gray-300 
                        hover:bg-gray-400 cursor-pointer
                    "
                    onClick={handlePreviousStep}
                >
                    Return Back
                </button>

                {orderData.paymentMethod === 'stripe'
                    ?
                        <button
                            className="py-2 px-5 border border-blue-700 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            onClick={handleNextStep}
                        >
                            Procceed to Payment
                        </button>
                    :
                        <button
                            className="py-2 px-5 border border-blue-700 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            onClick={handleNextStep}
                        >
                            Request Order
                        </button>
                }
            </div>
        </div>
    )
}

export default OrderSummary