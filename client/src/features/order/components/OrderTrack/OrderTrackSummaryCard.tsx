import { FC, ReactElement } from "react"
import { OrderTrackSummaryCardProps } from "../../order.interface";


const OrderTrackSummaryCard:FC<OrderTrackSummaryCardProps> = ({order}):ReactElement =>{

    if(!order) 
        return <></>

    return (
        <div className='w-full mx-auto max-w-[400px] p-2 pl-4 border border-greyB rounded-md bg-greyOrder '>
            <h3 className="text-lg font-medium my-1 mb-3 font-lato">Delivery Details</h3>

            <div className='flex flex-col bg-red-300a text-gray-500 '>
                {[
                    ['FirstName:', order.customer_first_name],
                    ['LastName:', order.customer_last_name],
                    ['Address:', order.shipping_address.split(",")[0]],
                    ['City:', order.shipping_address.split(",")[1]],
                    ['Post Code:', order.shipping_postal_code],
                    ['Phone:', order.customer_phone],
                    ['Email:', order.customer_email],
                ].map(([label, value]) => (
                    <div key={label} className="flex gap-x-5 ">
                        <label className="w-24 mb-1 ">{label}</label> {/* fixed width */}
                        <div className='text-gray-800 '>{value}</div>
                    </div>
                ))}
                <div className="flex gap-x-5 ">
                    <label className="w-24 mb-1 ">Payment:</label> {/* fixed width */}
                    <div className='text-gray-800 '>
                        {order.payment_type == 'stripe' ? 'Credit Card' : 'Cash on delivery'}
                    </div>
                </div>

                <div className="flex gap-x-5 mt-3 font-semibold text-gray-800">
                    <label className="w-24 mb-1 ">Total Price:</label> {/* fixed width */}
                    <div className='text-gray-800 '>${order.total_price}</div>
                </div>
            </div>
        </div>
    )
}

export default OrderTrackSummaryCard