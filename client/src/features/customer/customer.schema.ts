import { ObjectSchema, object, string, array, ref } from 'yup';
import { CustomerProfileInterface } from './customer.interface';
import { LocationInterface } from "../auth/auth.interfaces";

const customerProfileSchema: ObjectSchema<Partial<CustomerProfileInterface>> = object({
    firstName:string().optional(),
    lastName:string().optional(),
    fullName: string().optional(),
    phoneNumber: string().optional()
        .matches(
            /^(?:\+3816\d{7,8}|06\d{7,8})$/,
            'Enter a valid Serbian phone number'
        ),
    location: object().optional() as ObjectSchema<LocationInterface>,
    profileAvatarFile: string().optional(),
    profileAvatar: object({
        url: string().optional(),
        publicID: string().optional(),
    }).optional()
})

export { customerProfileSchema }