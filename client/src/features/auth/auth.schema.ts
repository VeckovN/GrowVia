import { ObjectSchema, object, string, array, mixed, ref } from 'yup';

import { SignUpCustomerFormInterface, SignUpFarmerFormInterface, SignInPayloadInterface, ResetPasswordFormInterface } from './auth.interfaces';
import { LocationInterface, FarmerLocationInterface } from './auth.interfaces';

const signUpCustomerSchema: ObjectSchema<SignUpCustomerFormInterface> = object({

    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),

    email: string()
        .required('Email is required')
        .email('Invalid email format'),

    password: string()
        .required('Password is required')
        .min(4, 'Password must be at least 4 characters'),

    repeatPassword: string()
        .required('Please confirm your password')
        .oneOf([ref('password')], 'Passwords must match'),

    userType: mixed<'customer'>()
        .oneOf(['customer'], 'User type must be customer')
        .required('User type is required'),

    profileAvatarFile: string().required('Profile avatar is required'),

    firstName: string()
        .required('First name is required')
        .min(3, 'First name must be at least 3 characters'),

    lastName: string()
        .required('Last First name is required')
        .min(3, 'Full name must be at least 3 characters'),

    phoneNumber: string()
        .required('Phone number is required')
        .matches(
            /^(?:\+3816\d{7,8}|06\d{7,8})$/,
            'Enter a valid Serbian phone number'
        ),
    location: object({
        city: string()
            .required('City is required')
            .min(2, 'City must be at least 2 characters'),
        address: string()
            .required('Address is required')
            .min(3, 'Address must be at least 3 characters')
    }).required('Location is required')
});

const signUpFarmerSchema: ObjectSchema<SignUpFarmerFormInterface> = object({

    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),

    email: string()
        .required('Email is required')
        .email('Invalid email format'),

    password: string()
        .required('Password is required')
        .min(4, 'Password must be at least 4 characters'),

    repeatPassword: string()
        .required('Please confirm your password')
        .oneOf([ref('password')], 'Passwords must match'),

    userType: mixed<'farmer'>()
        .oneOf(['farmer'], 'User type must be customer')
        .required('User type is required'),

    profileAvatarFile: string().required('Profile avatar is required'),

    backgroundImageFile: string().required('Background image is required'),

    firstName: string()
        .required('First name is required')
        .min(3, 'First name must be at least 3 characters'),

    lastName: string()
        .required('Last First name is required')
        .min(3, 'Full name must be at least 3 characters'),

    phoneNumber: string()
        .required('Phone number is required')
        .matches(
            /^(?:\+3816\d{7,8}|06\d{7,8})$/,
            'Enter a valid Serbian phone number'
        ),

     location: object({
        city: string()
            .required('City is required')
            .min(2, 'City must be at least 2 characters'),
        address: string()
            .required('Address is required')
            .min(3, 'Address must be at least 3 characters')
    }).required('Location is required'),

    farmName: string().required('FarmName is required'),
    description: string().min(30, 'Description must contain at least 30 characters').optional(),
    socialLlinks: array(string().required().url('Each social link must be a valid URL')).optional()
})

const signInSchema: ObjectSchema<SignInPayloadInterface> = object({
    usernameOrEmail: string().required('Username is required' ).min(3, 'Username must be at least 3 characters'),
    password: string().required('Password is required' ).min(4, 'Password must be at least 4 characters')
})

//Omit TS utility type that remove one of more properties from type or interface
//i want to remove 'token' from ResetPasswordPayloadInterface
// const resetPasswordSchema: ObjectSchema<
//     Omit<ResetPasswordPayloadInterface, 'token'>
// > = object({
const resetPasswordSchema: ObjectSchema<ResetPasswordFormInterface> = object({
    password: string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters'),

    confirmPassword: string()
        .required('Please confirm your password')
        .oneOf([ref('password')], 'Passwords must match'),
});

export { signUpFarmerSchema, signUpCustomerSchema, signInSchema, resetPasswordSchema }