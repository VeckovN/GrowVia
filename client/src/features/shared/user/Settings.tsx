import { FC, ChangeEvent, useState, ReactElement} from 'react';
import TextField from "../inputs/TextField";
import LoadingSpinner from '../page/LoadingSpinner';
import { useSchemaValidation } from '../hooks/useSchemaValidation';
import { useChangePasswordMutation } from '../../auth/auth.service';
import { UserSettingsPropInterface } from './user.interface';
import { userSettingsSchema } from './user.schema';
import toast from 'react-hot-toast';

const Settings: FC = ():ReactElement => {
    const [userData, setUserData] = useState<UserSettingsPropInterface>({
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
    })

    const [schemaValidation, validationErrors, resetValidationErrors] = useSchemaValidation({
        schema: userSettingsSchema, 
        userData
    });

    const [ changePassword, {isLoading} ] = useChangePasswordMutation();

    const [actionError, setActionError] = useState<string>('');

    const getFieldError = (fieldName: string) => validationErrors[fieldName];

    const getBorderErrorStyle = (field: string): string =>{
        if(actionError || getFieldError(field))
            return 'border-0 border-b-4 border-red-400';
        else
            return '';
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;

        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const onPasswordHandler = async():Promise<void> => {
        try{
            const isValid = await schemaValidation(); 

            if(!isValid){
                toast.error("Validation Field error");
                return;
            }
            const result = await changePassword({ 
                currentPassword: userData.currentPassword, 
                newPassword: userData.newPassword
            })

            setUserData({
                currentPassword: '',
                newPassword: '',
                repeatPassword: ''
            });

            toast.success("Your password successfully changed");

        }
        catch(error){
            console.error("Reset Password Error: ", error);
        }
    }

    const onDeleteAccount = ():void => {
        //Display 'Delete modal'
    }

    return (
        <div className="space-y-6 px-5">
            <h3 className='text-xl font-medium'>
                Settings
            </h3>

            <div className='pt-8 pb-6 border-b border-greyB'>
                <h4 className='text-md my-6 font-medium'>
                    Password
                </h4>

                {/* Row 1 - FarmName (half width) */}
                <div className="w-full md:w-1/2 md:pr-2 mb-5">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('currentPassword')}
                        `}
                        id="currentPassword"
                        value={userData.currentPassword}
                        name="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        onChange={handleChange}
                    />
                    {validationErrors.currentPassword &&
                        <label className='text-red-600 text-sm'>{validationErrors.currentPassword}</label>
                    }
                </div>
            
                {/* Row 2 - FirstName & LastName */}
                <div className="flex flex-col md:flex-row gap-5 ">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <TextField
                            className={`
                                w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                                focus:border-green2 focus:border-4
                                ${getBorderErrorStyle('newPassword')}
                            `}
                            id="newPassword" //match label htmlFor 
                            value={userData.newPassword}
                            name="newPassword"
                            type="password"
                            placeholder='Enter your new password'
                            onChange={handleChange}
                        />
                        {validationErrors.newPassword &&
                            <label className='text-red-600 text-sm'> {validationErrors.newPassword}</label>
                        }
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="repeatPassword" className="text-sm font-medium text-gray-700">
                            Repeat Password
                        </label>
                        <TextField
                            className={`
                                w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                                focus:border-green2 focus:border-4
                                ${getBorderErrorStyle('repeatPassword')}
                            `}
                            id="repeatPassword" //match label htmlFor 
                            value={userData.repeatPassword}
                            name="repeatPassword"
                            type="password"
                            placeholder="Confirm new password "
                            onChange={handleChange}
                        />
                        {validationErrors.repeatPassword &&
                            <label className='text-red-600 text-sm'> {validationErrors.repeatPassword}</label>
                        }  
                    </div>
                </div>

                <div className='mt-3'>
                    <p className=''>
                        Forgot Password? <span className='text-green5 cursor-pointer hover:text-green7'> Reset your password</span>
                    </p>
                </div>

                <div className='w-full flex justify-center items-center gap-x-3 pt-6 '>
                    <button 
                        className="w-full max-w-[220px] p-2 rounded-md text-white font-semibold bg-green7" 
                        onClick={onPasswordHandler}
                    > Change Password
                    </button>

                    {isLoading &&
                        <div className='bg-red-1'>
                            <LoadingSpinner
                                spinnerClassName='text-green5'
                            />
                        </div>
                    }
                </div>
            </div>

            <div className='mt-2'>
                <h4 className='text-md font-medium py-5'>
                    Delete Account
                </h4>

                <div className='text-gray-600'>
                    <p className='py-2'>
                        Permanently delete your account and all associated data.
                    </p>
                    <p>
                        This action cannot be undone. Once you delete your account, all your profile information, products, orders, and saved preferences will be permanently removed from our system.
                    </p>
                </div>

                <div className='w-full flex justify-center items-center gap-x-3 pt-6 '>
                    <button 
                        className="
                            w-full max-w-[220px] p-2 border-2 border-red-700 rounded-md text-red-700 font-semibold bg-white
                            hover:bg-red-700 hover:text-white transition duration-200 ease-in-out
                        " 
                        onClick={onDeleteAccount}
                    > Delete my account
                    </button>

                    {/* {isLoadingDeleting &&
                        <div className=''>
                            <LoadingSpinner
                                spinnerClassName='text-red-600'
                            />
                        </div>
                    } */}
                </div>

            </div>
        </div>
    )
}

export default Settings