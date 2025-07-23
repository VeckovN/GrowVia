import { ObjectSchema, object, string, ref } from 'yup';
import { UserSettingsPropInterface } from './user.interface';

const userSettingsSchema: ObjectSchema<UserSettingsPropInterface> = object({

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

export { userSettingsSchema }