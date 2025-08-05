import { FC, ReactElement } from "react";
import { OrderSummaryInterface } from "../../order.interface";
import OrderProductsList from "../OrderProductsList";
import codCardIcon from '../../../../assets/paymentCards/Cod.svg';
import stripeCardIcon from '../../../../assets/paymentCards/Stripe.svg';
 

const OrderSummary:FC<OrderSummaryInterface> = ({orderData, priceDetails, cartData, handleNextStep, handlePreviousStep}):ReactElement => {

    const getCreaditCardIcon = (paymentMethod: string) => {
        return paymentMethod === 'stripe' ? stripeCardIcon : codCardIcon
    }

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

            <div 
                className="
                    grid 
                    grid-cols-1 
                    sm:[grid-template-columns:repeat(2,320px)] 
                    lg:[grid-template-columns:320px_320px_300px]
                    gap-4 
                    place-items-center
                    sm:place-items-start
                    sm:justify-center
                ">
                <div className='w-full  max-w-[320px] sm:max-w-none p-2 pl-4 border border-greyB rounded-md bg-greyOrder '>
                    <h3 className="text-lg font-medium my-1 mb-3 font-lato">Delivery Details</h3>

                    <div className='flex flex-col bg-red-300a text-gray-500 '>
                        {[
                            ['FirstName:', orderData.firstName],
                            ['LastName:', orderData.lastName],
                            ['Address:', orderData.address],
                            ['City:', orderData.city],
                            ['Post Code:', orderData.postCode],
                            ['Phone:', orderData.phone],
                            ['Email:', orderData.email],
                        ].map(([label, value]) => (
                            <div key={label} className="flex  gap-x-5 ">
                                <label className="w-24 mb-1 ">{label}</label> {/* fixed width */}
                                <div className='text-gray-800 '>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='h-[100px] w-full max-w-[320px] sm:max-w-none mx-auto p-2 pl-2 border border-greyB rounded-md bg-greyOrder'>
                    <h3 className="text-lg font-medium my-1 font-lato">Payment Method</h3>
                    
                    <div className="flex gap-x-4 text-gray-500">
                        <label className="w-24 my-2">Card</label> {/* fixed width */}
                        <div className="flex justify-center items-center gap-x-1">
                            <img
                                className='w-14 h-10'
                                src={getCreaditCardIcon(orderData.paymentMethod ?? "")}    
                            />

                            <label className='text-gray-800'>
                            {orderData.paymentMethod === 'stripe'
                                ? 'Credit Card'
                                : 'on Delivery'
                            } 
                            </label>
                        </div>
                    </div>
                </div>

                <div className='max-w-[280px] sm:max-w-none  p-2 pl-4 border border-greyB rounded-md bg-greyOrder'>
                    <h3 className="text-lg font-medium mt-2 mb-4 font-lato">Summary</h3>
                
                    <div className='flex flex-col bg-red-300a text-gray-500'>
                         <div className="flex gap-x-5">
                            <label className="w-44 mb-2">SubTotal</label> {/* fixed width */}
                            <div className='text-gray-800'>${priceDetails.subTotal}</div>
                        </div>
                        <div className="flex gap-x-5">
                            <label className="w-44 mb-2">Shipping</label> {/* fixed width */}
                            <div className='text-gray-800'>{priceDetails.shipping === 0 ? 'Free' : `$${priceDetails.shipping}`}</div>
                        </div>
                        <div className="flex gap-x-5">
                            <label className="w-44 mb-2">{`Tax (4%)`}</label> {/* fixed width */}
                            <div className='text-gray-800'>${priceDetails.taxAmount.toFixed(2)}</div>
                        </div>

                        <div className="flex mt-2 pl-2 gap-x-1 font-bold">
                            <label className="w-44 mb-2">Total</label> {/* fixed width */}
                            <div className='text-gray-800'>${priceDetails.total.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

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