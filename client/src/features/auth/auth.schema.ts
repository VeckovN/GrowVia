import { ObjectSchema, object, string, array, mixed, ref } from 'yup';

import { SignUpFormInterface, SignInPayloadInterface, ResetPasswordFormInterface } from './auth.interfaces';
import { LocationInterface, FarmerLocationInterface } from './auth.interfaces';

const signUpSchema: ObjectSchema<SignUpFormInterface> = object({

    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),

    email: string()
        .required('Email is required')
        .email('Invalid email format'),

    password: string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters'),

    repeatPassword: string()
        .required('Please confirm your password')
        .oneOf([ref('password')], 'Passwords must match'),

    userType: mixed<'customer' | 'farmer'>()
        .oneOf(['customer', 'farmer'], 'Invalid user type')
        .required('User type is required'),

    profilePicture: string().required('Profile picture is required'),
    backgroundImage: string().optional(),

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

    location: object().required('Location is required') as ObjectSchema<LocationInterface | FarmerLocationInterface>,
    farmName: string().optional(),
    description: string().optional(),
    socialLlinks: array(string().required().url('Each social link must be a valid URL')).optional()
})

const signInSchema: ObjectSchema<SignInPayloadInterface> = object({
    usernameOrEmail: string().required('Username is required' ).min(3, 'Username must be at least 3 characters'),
    password: string().required('Password is required' ).min(5, 'Password must be at least 5 characters')
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

export { signUpSchema, signInSchema, resetPasswordSchema }