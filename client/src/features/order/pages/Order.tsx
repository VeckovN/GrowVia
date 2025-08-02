import { FC, ReactElement, useState, Suspense, lazy } from "react";
import toast from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import { ReduxStateInterface } from "../../../store/store.interface";
import { OrderDataInterface, CardPaymentDataInterface, OrderPriceInfoInterface, PaymentType, CardType } from "../order.interface";
import { CartFarmerGroupInterface } from "../../cart/cart.interface";
import LoadingSpinner from "../../shared/page/LoadingSpinner";
import { useSchemaValidation } from "../../shared/hooks/useSchemaValidation.tsx";
import { orderDeliveryDetailsSchema, paymentDetailsSchema } from "../order.schema.ts";

const OrderCheckout = lazy(() => import("../components/OrderCheckout/OrderCheckout.tsx"));
const OrderSummary = lazy(() => import("../components/OrderSummary/OrderSummary.tsx"));
const OrderPayment = lazy(() => import("../components/OrderPayment/OrderPayment.tsx"));

//DON'T FORGET TO DO: On successfull order request remove order cart from redux

const Order:FC = ():ReactElement => {
    const { farmerID } = useParams(); //from url :farmerID
    const cart = useAppSelector((state: ReduxStateInterface) => state.cart)
    const cartData:CartFarmerGroupInterface | undefined = cart.data.find(group => group.farmerID === farmerID);
    console.log("cartDataG: ", cartData);


    const subTotal = cartData
        ? cartData.products.reduce((acc, item) => acc + Number(item.totalPrice), 0)
        : 0;

    // Free shipping over $40, otherwise $2 (like above )
    //Tax allways 4% but if the subTotal > 40 shipping is free, otherwise 2$
    const shipping = subTotal > 40 ? 0 : 2;
    const taxAmount = subTotal * 0.04; 
    const total = subTotal + shipping + taxAmount;

    const priceDetails:OrderPriceInfoInterface = {
        subTotal,
        shipping,
        taxAmount,
        total
    }

    const initialOrderData = {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postCode: '',
        phone: '',
        email: '',
        paymentMethod: null,
    }

    const initialPaymentData = {
        email: '',
        cardNumber: '',
        date: '', //consider Date type
        cvv: '',
        country: '', 
        total: total, //total from priceDetails
        cardType: null,
        //on payment response we should go *i think we got this dirreclty from stripe?
        // payment_intent_id
        // payment_method_id
        //"payment_method": "pm_card_visa", 
    }

    //Steps: 1-Checkout, 2-Summary, 3-Payment(only for card options -> selected in Checkout)
    const [step, setStep] = useState<number>(1);
    const [orderData, setOrderData] = useState<OrderDataInterface>({...initialOrderData});
    const [paymentData, setPaymentData] = useState<CardPaymentDataInterface>({...initialPaymentData});

    const [validateOrderData, valOrderDataErrors, resetValOrderDataErrors] = useSchemaValidation({
        schema: orderDeliveryDetailsSchema,
        userData: orderData   
    });

    const [validatePaymentData, valPaymentDataError ,resetValPaymentDataErros] = useSchemaValidation({
        schema: paymentDetailsSchema,
        userData: paymentData   
    });
        
    console.log("orderDDDD: ", orderData);
    console.log("steP: ", step);

    // Always validate delivery data before allowing step change from 1 → 2
    
    // In Step 2: if payment method is 'cod', submit order directly
    // If 'stripe', move to Step 3 where stripe form needs its own validation

    // Stripe form validation is isolated and only triggered in Step 3
    const handleNextStep = async(): Promise<void> => {
        try{
            if(step === 1){
                const isValid = await validateOrderData();
                if(!isValid){
                    toast.error("Order Data validation faild!");
                    return;
                }
                setStep(2);
            }
    
            if(step === 2){
                if(orderData.paymentMethod === 'cod'){
                    // await makeOrder();
                    console.log("ORDER REQUESTED");
                }
                else if(orderData.paymentMethod === 'visa' || orderData.paymentMethod === 'master') {
                    setPaymentData(prev => ({...prev, cardType:orderData.paymentMethod as CardType}))
                    setStep(3);
                }
            }
        }
        catch(error){
            console.error("Order error: ", error);
            toast.error("Something went wrong, Please try again");
        }
    }


    const handlePreviousStep = (): void => {
        if(step > 1){
            setStep(prev => prev -1);
        }
    }

    const handlePaymentOrderRequest = async():Promise<void> => {
        try{
            //ensure it's 3th step
            if(step === 3){
                const isValid = await validatePaymentData();
                if(!isValid){
                    toast.error("Payment data validation faild!")
                    return;
                }
                // makeOrder();
            }
        }
        catch(error){
            //Set glogal error on submitOrder failing
            toast.error("Validation faild!")
            console.log("OrderPayment error: ", error);
        }
    }


    const makeOrder = async(type: PaymentType, orderData:OrderDataInterface, paymentData):Promise<void> => {      
        try{
            //One of the options is to:
            //pass orderData,cardData and userData to the requestOrder RTQ Mutation (in it transform data to API response requested)        
        }
        catch(error){
            //set global error 
        }
    }

    const hanldeCodOrderRequest = async():Promise<void> => {
        //call
        //makeOrder()
    }

    return ( 
        <div className='w-full px-3 sm:px-4 lg:px-6 bg-red-300a'>
            {cartData && (
                <Suspense fallback={
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white"> 
                        <div>
                            <LoadingSpinner spinnerClassName="text-black"/> 
                        </div>
                    </div>
                }>
                    {/* lookup object pattern clean alternative to 'switch' */}
                    {{
                        1: <OrderCheckout //step === 1
                                orderData={orderData} 
                                setOrderData={setOrderData}
                                cartData={cartData}
                                validationErrorData={valOrderDataErrors}
                                priceDetails={priceDetails}
                                handleNextStep={handleNextStep}
                            />,
                        2: <OrderSummary 
                                orderData={orderData} 
                                cartData={cartData}
                                priceDetails={priceDetails}
                                handleNextStep={handleNextStep}
                                handlePreviousStep={handlePreviousStep}
                            />,
                        3: <OrderPayment
                                paymentData={paymentData}
                                setPaymentData={setPaymentData}
                                validationErrorData={valPaymentDataError}
                                handlePreviousStep={handlePreviousStep}
                                handlePaymentOrderRequest={handlePaymentOrderRequest}
                            />
                    }[step]}
                </Suspense>
            )}
        </div>
    )
}

export default Order;
    