import { ChangeEvent } from "react";
import { CartFarmerGroupInterface } from "../cart/cart.interface";
import { ValidationErrorMap } from "../shared/hooks/useSchemaValidation";

// export type PaymentType = 'cod' | 'stripe';
//visa or master are stripe supported
export type PaymentType = 'cod' | 'visa' | 'master' ;
export type CardType = 'visa' | 'master';

export interface OrderDataInterface {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postCode: string;
    phone: string;
    email: string;
    // paymentMethod: 'cod' | 'visa' | 'master' | null
    paymentMethod: PaymentType | null
}

export interface OrderPriceInfoInterface {
    subTotal: number;
    shipping: number;
    taxAmount: number;
    total: number;
}

export interface OrderCheckoutInterface {
    cartData: CartFarmerGroupInterface;
    orderData: OrderDataInterface;
    priceDetails: OrderPriceInfoInterface;
    validationErrorData: ValidationErrorMap;
    setOrderData: React.Dispatch<React.SetStateAction<OrderDataInterface>>;
    handleNextStep: () => Promise<void>;
}

export interface DeliveryDetailsFormPropsInterface {
    orderData: OrderDataInterface;
    validationErrorData: ValidationErrorMap; 
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface DeliveryOrderSummaryPropsInterface {
    priceDetails: OrderPriceInfoInterface;
    handleNextStep: () => Promise<void>;
}

export interface DeliveryCardOptionsPropsInterface {
    onPaymentSelect: (method:PaymentType) => void;
    validationError: string;
    paymentOption: string | null;
}


export interface OrderSummaryInterface {
    cartData: CartFarmerGroupInterface;
    orderData: OrderDataInterface;
    priceDetails: OrderPriceInfoInterface;
    handleNextStep: () => Promise<void>;
    handlePreviousStep: () => void;
}


export interface CardPaymentDataInterface {
    email: string,
    cardNumber: string;
    date: string; //consider Date type
    cvv: string;
    country: string; 
    total: number;
    cardType: CardType | null; //only visa and master from PaymentType 

    //on payment response we should go *i think we got this dirreclty from stripe?
    // payment_intent_id
    // payment_method_id
    //"payment_method": "pm_card_visa", 
}

// export interface OrderPaymentInterface {
//     onSubmitPayment: (paymentData: CardPaymentDataInterface) => void;
// }

export interface OrderPaymentInterface {
    paymentData: CardPaymentDataInterface;
    setPaymentData: React.Dispatch<React.SetStateAction<CardPaymentDataInterface>>;
    validationErrorData: ValidationErrorMap;
    handlePreviousStep: () => void;
    handlePaymentOrderRequest: () => Promise<void>;
}

export interface OrderProductsListPropsInterface {
    cartData: CartFarmerGroupInterface;
    isCheckout: boolean; 
}



//FOR API BODY REQUEST
export interface OrderItemRequestInterface {
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface OrderRequestBody {
    customer_id: string;
    customer_username: string;
    customer_email: string;
    farmer_id: string;
    farmer_username: string;
    farmer_email: string;
    invoice_id: string;
    total_price: number;
    payment_status: 'pending';
    order_status: 'pending';
    payment_type: PaymentType;
    payment_intent_id?: string;
    payment_method_id?: string;
    payment_method?: string;
    shipping_address: string;
    tracking_url?: string;
    orderItems: OrderItemRequestInterface[];
}