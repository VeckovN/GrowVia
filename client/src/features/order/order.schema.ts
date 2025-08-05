import { ObjectSchema, object, string, array, mixed, ref } from 'yup';
import { OrderDataInterface, CardPaymentDataInterface } from "./order.interface";

const orderDeliveryDetailsSchema: ObjectSchema<OrderDataInterface> = object({
    
    firstName: string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters'),

    lastName: string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters'),

    address: string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),

    city: string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),

    postCode: string()
    .required('Post code is required')
    .matches(/^\d{5}$/, 'Post code must be 5 digits'),

    phone: string()
    .required('Phone number is required')
    .matches(
        /^(?:\+3816\d{7,8}|06\d{7,8})$/,
        'Enter a valid Serbian phone number'
    ),

    email: string()
    .required('Email is required')
    .email('Invalid email format'),

    paymentMethod: mixed<'cod' | 'stripe'>()
    .oneOf(['cod', 'stripe'], 'Select a valid payment method')
    .required('Payment method is required')
});

const paymentDetailsSchema: ObjectSchema<Pick<CardPaymentDataInterface, 'email' | 'country'>> = object({
    
    email: string()
    .required('Email is required')
    .email('Invalid email format'),

    country: string()
        .required('Country is required')
        .min(2, 'Country must be at least 2 characters'),
});




export { orderDeliveryDetailsSchema, paymentDetailsSchema }