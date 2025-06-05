import { ObjectSchema, object, string, array, mixed  } from 'yup';

import { SignUpPayloadInterface, SignInPayloadInterface } from './auth.interfaces';
import { LocationInterface, FarmerLocationInterface } from './auth.interfaces';

const signupSchema: ObjectSchema<SignUpPayloadInterface> = object({
    
    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    
    email: string()
        .required('Email is required')
        .email('Invalid email format'),

    password: string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),

    userType: mixed<'customer' | 'farmer'>()
        .oneOf(['customer', 'farmer'], 'Invalid user type')
        .required('User type is required'),

    profilePicture: string().required('Profile picture is required'),

    fullName: string()
        .required('Full name is required')
        .min(6, 'Full name must be at least 6 characters'),

    location: object().required('Location is required') as ObjectSchema<LocationInterface | FarmerLocationInterface>,
    farmName: string().optional(),
    description: string().optional(),
    socialLlinks: array(string().required().url('Each social link must be a valid URL')).optional()
})

const signinSchema: ObjectSchema<SignInPayloadInterface> = object({
    usernameOrEmail: string().required({ username: 'Username is required'}).min(3, { username: 'Username is a required field'}),
    password: string().required({ password: 'Password is required' }).min(4, { password: 'Password is arequired field' })
})

export { signupSchema, signinSchema }