import { FC, ReactElement } from 'react';
import { OrderSummaryDetailsPropInterface } from '../../order.interface';
import codCardIcon from '../../../../assets/paymentCards/Cod.svg';
import stripeCardIcon from '../../../../assets/paymentCards/Stripe.svg';


const OrderSummaryDetails:FC<OrderSummaryDetailsPropInterface> = (orderSummaryData):ReactElement => {

    const getCreaditCardIcon = (paymentMethod: string) => {
    return paymentMethod === 'stripe' ? stripeCardIcon : codCardIcon}

    return (
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
                        ['FirstName:', orderSummaryData.firstName],
                        ['LastName:', orderSummaryData.lastName],
                        ['Address:', orderSummaryData.address],
                        ['City:', orderSummaryData.city],
                        ['Post Code:', orderSummaryData.postCode],
                        ['Phone:', orderSummaryData.phone],
                        ['Email:', orderSummaryData.email],
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
                            src={getCreaditCardIcon(orderSummaryData.paymentMethod ?? "")}    
                        />

                        <label className='text-gray-800'>
                        {orderSummaryData.paymentMethod === 'stripe'
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
                        <div className='text-gray-800'>${orderSummaryData.subTotal.toFixed(2)}</div>
                    </div>
                    <div className="flex gap-x-5">
                        <label className="w-44 mb-2">Shipping</label> {/* fixed width */}
                        <div className='text-gray-800'>{orderSummaryData.shipping === 0 ? 'Free' : `$${orderSummaryData.shipping}`}</div>
                    </div>
                    <div className="flex gap-x-5">
                        <label className="w-44 mb-2">{`Tax (4%)`}</label> {/* fixed width */}
                        <div className='text-gray-800'>${orderSummaryData.taxAmount.toFixed(2)}</div>
                    </div>

                    <div className="flex mt-2 pl-2 gap-x-1 font-bold">
                        <label className="w-44 mb-2">Total</label> {/* fixed width */}
                        <div className='text-gray-800'>${orderSummaryData.total.toFixed(2)}</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OrderSummaryDetails