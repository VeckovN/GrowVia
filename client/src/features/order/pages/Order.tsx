import { FC, ReactElement, useState, useMemo, Suspense, lazy } from "react";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { useAppSelector } from "../../../store/store";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { ReduxStateInterface } from "../../../store/store.interface";
import { removeGroup } from "../../cart/cart.reducers.ts";
import { OrderDataInterface, CardPaymentDataInterface, OrderPriceInfoInterface, CardType, OrderCreateDataInterface, OrderItemRequestInterface, OrderRequestBodyInterface } from "../order.interface";
import LoadingSpinner from "../../shared/page/LoadingSpinner";
import { useSchemaValidation } from "../../shared/hooks/useSchemaValidation.tsx";
import { orderDeliveryDetailsSchema, paymentDetailsSchema } from "../order.schema.ts";
import { useCreateOrderMutation } from "../order.service.ts";
import { useGetFarmerByIDQuery } from '../../farmer/farmer.service.ts';

const OrderCheckout = lazy(() => import("../components/OrderCheckout/OrderCheckout.tsx"));
const OrderSummary = lazy(() => import("../components/OrderSummary/OrderSummary.tsx"));
const OrderPayment = lazy(() => import("../components/OrderPayment/OrderPayment.tsx"));

const Order: FC = (): ReactElement => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { farmerID } = useParams(); //from url :farmerID
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const cart = useAppSelector((state: ReduxStateInterface) => state.cart)
    const cartData = useMemo(() => {
        return cart.data.find(group => group.farmerID === farmerID)
    }, [cart, farmerID]); //re-crete cartData only when cart changed or farmerID

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
    
    const subTotal = cartData
        ? cartData.products.reduce((acc, item) => acc + Number(item.totalPrice), 0)
        : 0;

    //Free shipping over $40, otherwise $2 
    //Tax allways 4% but if the subTotal > 40 shipping is free, otherwise 2$
    const shipping = subTotal > 40 ? 0 : 2;
    const taxAmount = subTotal * 0.04;
    const total = subTotal + shipping + taxAmount;

    const priceDetails: OrderPriceInfoInterface = {
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
        country: '',
        total: total, //total from priceDetails
        cardType: null,
        paymentMethodID: '',
    }

    //Steps: 1-Checkout, 2-Summary, 3-Payment(only for card options -> selected in Checkout)
    const [step, setStep] = useState<number>(1);
    const [orderData, setOrderData] = useState<OrderDataInterface>({ ...initialOrderData });
    const [paymentData, setPaymentData] = useState<CardPaymentDataInterface>({ ...initialPaymentData });

    const [validateOrderData, valOrderDataErrors, resetValOrderDataErrors] = useSchemaValidation({
        schema: orderDeliveryDetailsSchema,
        userData: orderData
    });

    const [validatePaymentData, valPaymentDataError, resetValPaymentDataErros] = useSchemaValidation({
        schema: paymentDetailsSchema,
        userData: paymentData
    });


    const { data: farmerResult, isLoading: isFarmerLoading } = useGetFarmerByIDQuery(cartData?.farmerID as string, {
        skip: !cartData?.farmerID,
    });

    const [createOrder] = useCreateOrderMutation();

    // Always validate delivery data before allowing step change from 1 → 2
    // In Step 2: if payment method is 'cod', submit order directly
    // If 'stripe', move to Step 3 where stripe form needs its own validation
    const handleNextStep = async (): Promise<void> => {
        try {
            if (step === 1) {
                const isValid = await validateOrderData();
                if (!isValid) {
                    toast.error("Order Data validation faild!");
                    return;
                }
                setStep(2);
            }

            if (step === 2) {
                if (orderData.paymentMethod === 'cod') {
                    await hanldeCodOrderRequest();
                }
                else if (orderData.paymentMethod === 'stripe') {
                    setPaymentData(prev => ({ ...prev, cardType: orderData.paymentMethod as CardType }))
                    setStep(3);
                }
            }
        }
        catch (error) {
            console.error("Order error: ", error);
            toast.error("Something went wrong, Please try again");
        }
    }

    const handlePreviousStep = (): void => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    }

    const handlePaymentOrderRequest = async (newPaymentMethodID: string): Promise<void> => {
        try {
            if (step === 3) {
                const isValid = await validatePaymentData();
                if (!isValid) {
                    toast.error("Payment data validation faild!")
                    return;
                }

                if (!cartData) {
                    console.error("Cart data is undefined.");
                    return;
                }

                const data: OrderCreateDataInterface = {
                    orderData,
                    //due to rece condition 
                    paymentData: {
                        ...paymentData,
                        paymentMethodID: newPaymentMethodID || paymentData.paymentMethodID
                    },
                    cartData,
                    userData: {
                        id: authUser.id,
                        username: authUser.username,
                        email: authUser.email
                    }
                }
                await makeOrder(data);
            }
        }
        catch (error) {
            //Set glogal error on submitOrder failing
            console.error("OrderPayment error: ", error);
            toast.error("Validation faild!")
        }
    }


    const makeOrder = async (data: OrderCreateDataInterface) => {

        const { orderData, paymentData, cartData, userData } = data;

        try {
            const orderItems: OrderItemRequestInterface[] = cartData.products.map(el => ({
                product_id: el.productID,
                quantity: el.quantity,
                unit_price: el.price,
                total_price: Number(el.totalPrice),
            }));

            if (isFarmerLoading) {
                toast.error("Farmer's data is still loading, please wait a moment and try again.");
                return; // exit the function early to avoid using unassigned variable
            }

            let createOrderData: OrderRequestBodyInterface;

            if (orderData.paymentMethod === 'stripe') {

                createOrderData = {
                    customer_id: String(userData.id!),
                    customer_username: userData.username,
                    customer_email: userData.email,
                    farmer_id: cartData.farmerID!, 
                    farmer_username: farmerResult?.farmer.username ?? '',
                    farmer_email: farmerResult?.farmer.email ?? '',
                    invoice_id: 'inv123123', //Later
                    total_price: subTotal,
                    payment_type: 'stripe',
                    payment_status: 'pending', //default on create Order
                    order_status: 'pending',
                    payment_method_id: paymentData.paymentMethodID, //From stripe
                    shipping_address: orderData.address, //from orderData
                    // billing_address: paymentData.address
                    tracking_url: '', // if needed
                    orderItems,
                };
            }
            else {
                createOrderData = {
                    customer_id: String(userData.id!),
                    customer_username: userData.username,
                    customer_email: userData.email,
                    farmer_id: cartData.farmerID!, //35
                    farmer_username: farmerResult?.farmer.username ?? '',
                    farmer_email: farmerResult?.farmer.email ?? '',
                    invoice_id: 'inv123123', //Later
                    total_price: subTotal,
                    payment_type: 'cod', 
                    order_status: 'pending', //default on create Order
                    shipping_address: orderData.address, //from orderData
                    tracking_url: '', // if needed
                    orderItems,
                };
            }

            await createOrder(createOrderData).unwrap();
            dispatch(removeGroup({farmerID:farmerID}));

            toast.success("You successfully requested order, Please wait on farmer approval")
            navigate('/');
        } catch (error) {
            console.error("create Order error: ", error);
            toast.error('Create order error, please try again!');
        }
    };

    const hanldeCodOrderRequest = async (): Promise<void> => {

        if (!cartData) {
            console.error("Cart data is undefined.");
            return;
        }

        const data: OrderCreateDataInterface = {
            orderData,
            paymentData,
            cartData,
            userData: {
                id: authUser.id,
                username: authUser.username,
                email: authUser.email
            }
        }

        await makeOrder(data)
    }

    return (
        <div className='w-full px-3 sm:px-4 lg:px-6 bg-red-300a'>
            {(cartData) && (
                <Suspense fallback={
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                        <div>
                            <LoadingSpinner spinnerClassName="text-black" />
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
                        3: <Elements stripe={stripePromise}>
                            <OrderPayment
                                paymentData={paymentData}
                                setPaymentData={setPaymentData}
                                validationErrorData={valPaymentDataError}
                                handlePreviousStep={handlePreviousStep}
                                handlePaymentOrderRequest={handlePaymentOrderRequest}
                            />
                        </Elements>
                    }[step]}
                </Suspense>
            )}
        </div>
    )
}

export default Order;
