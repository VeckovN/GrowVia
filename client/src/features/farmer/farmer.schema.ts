import { ObjectSchema, object, string, array, ref } from 'yup';
import { FarmerProfileInterface, FarmerSettingsPropInterface } from "./farmer.interface";
import { FarmerLocationInterface } from "../auth/auth.interfaces";

const farmerProfileSchema: ObjectSchema<Partial<FarmerProfileInterface>> = object({
    firstName:string().optional(),
    lastName:string().optional(),
    fullName: string().optional(),
    farmName: string().optional(),
    phoneNumber: string().optional()
        .matches(
            /^(?:\+3816\d{7,8}|06\d{7,8})$/,
            'Enter a valid Serbian phone number'
        ),
    location: object().optional() as ObjectSchema<FarmerLocationInterface>,
    profileAvatarFile: string().optional(),
    profileAvatar: object({
        url: string().optional(),
        publicID: string().optional(),
    }).optional(),
    backgroundImageFile: string().optional(),
    backgroundImage: object({
        url: string().optional(),
        publicID: string().optional(),
    }).optional(),
    description: string().optional(),
    // socialLinks: array(string().url('Each social link must be a valid URL')).optional(),
    socialLinks: array(
        object({
            // name: string().optional(),
            name: string().required("Platform name is required"),
            // url: string().url('Enter a valid URL').optional()
            url: string().url('Enter a valid URL').required("URL is required")
        })
    ).optional(),
})

const farmerSettingsSchema: ObjectSchema<FarmerSettingsPropInterface> = object({

    currentPassword:string().required('Current password is required'),

    newPassword: 
        string()
        .min(4, 'New password must be at least 4 characters')
        .required('New password is required'),

    repeatPassword:  
        string()
        .oneOf([ref('newPassword')], 'Passwords must match')
        .required('Please repeat your new password'),
})

export { farmerProfileSchema, farmerSettingsSchema}