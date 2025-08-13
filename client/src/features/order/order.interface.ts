import { ChangeEvent } from "react";
import { CartFarmerGroupInterface } from "../cart/cart.interface";
import { AuthUserInterface } from "../auth/auth.interfaces";
import { ValidationErrorMap } from "../shared/hooks/useSchemaValidation";

// export type PaymentType = 'cod' | 'stripe';
//visa or master are stripe supported
export type PaymentType = 'cod' | 'stripe' ;
export type CardType = 'visa' | 'master';

export type OrderStatusType = 'pending' | 'accepted' | 'canceled' | 'rejected' | 'processing' | 'shipped' | 'completed'
export type OrderPaymentStatusType = 'pending' | 'authorized' | 'paid' | 'refunded' | 'canceled';


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
    country: string; 
    total: number;
    cardType: CardType | null;
    paymentMethodID: string;
}


export interface OrderPaymentInterface {
    paymentData: CardPaymentDataInterface;
    setPaymentData: React.Dispatch<React.SetStateAction<CardPaymentDataInterface>>;
    validationErrorData: ValidationErrorMap;
    handlePreviousStep: () => void;
    handlePaymentOrderRequest: (paymentMethodID: string) => Promise<void>;
}

export interface OrderProductsListPropsInterface {
    cartData: CartFarmerGroupInterface;
    isCheckout: boolean; 
}


//FOR API BODY REQUEST
export interface OrderItemRequestInterface {
    product_id: string;
    product_name: string;    
    product_image_url: string;  
    product_unit: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface OrderRequestBodyInterface {  
    customer_id: string;
    customer_username: string;
    customer_email: string;
    customer_first_name?: string; // form field snapshot
    customer_last_name?: string;  // form field snapshot
    customer_phone?: string;      // form field snapshot
    farmer_id: string;
    farmer_username: string;
    farmer_email: string;
    invoice_id: string;
    total_price: number;
    payment_status?: OrderPaymentStatusType;
    order_status: OrderStatusType;
    payment_type: 'cod' | 'stripe';
    payment_method_id?: string;
    billing_address?: string;
    shipping_address: string;
    shipping_postal_code?: string;
    tracking_url?: string;
    orderItems: OrderItemRequestInterface[];
}

export interface OrderDocumentInterface extends OrderRequestBodyInterface{
    order_id: string; //for retreiving  
    created_at: Date | string;
    updated_at: Date | string;
}

// Extracts only {id, email, username} from AuthUserInterface (Redux-auth user)
// Stays in sync with AuthUserInterface if those fields change
export type MinimalUserInterface = Pick<AuthUserInterface, 'id' | 'username' | 'email'>

export interface OrderCreateDataInterface {
    orderData: OrderDataInterface;
    paymentData: CardPaymentDataInterface;
    cartData: CartFarmerGroupInterface;
    // Basic user info from Redux-auth user
    userData: MinimalUserInterface
}

export type SelectedOrderStatusType = {
    orderID: string,
    orderStatus: string
}

export interface OrderChangeStatusInterface {
    orderID: string;
    orderStatus: string;
    onChangeStatus: (orderID: string, newStatus: OrderStatusType ) => Promise<void>;
    onClose: () => void;
}

export interface OrderItemsListPropsInterface {
    orderItems:  OrderItemRequestInterface[]
}

export interface OrderStatusTimeLineProps {
    currentStatus: string
}

export interface OrderTrackSummaryCardProps {
    order: OrderDocumentInterface | null;
}
