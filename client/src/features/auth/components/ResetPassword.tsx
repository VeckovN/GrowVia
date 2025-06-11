import { FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../auth.service';
import { useAuthValidation } from '../hooks/useAuthValidation';
import { resetPasswordSchema } from '../auth.schema';

import TextField from '../../shared/inputs/TextField';

import BackGroundImage from '../../../assets/AuthBackground.jpg';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { ResetPasswordPayloadInterface, PasswordInvisibility } from '../auth.interfaces';

const ResetPassword:FC = () => {
    const [userInfo, setUserInfo] = useState<{password:string, confirmPassword:string}>({
        password:'',
        confirmPassword:''
    });
    const [showPassword, setShowPassword] = useState<PasswordInvisibility>({
        password:false,
        confirmPassword:false
    });
    const [responseMessage, setResponseMessage] = useState<{message?:string, error?:string}>({});
    const [schemaValidation, validationErrors] = useAuthValidation({schema: resetPasswordSchema, userData: userInfo});
    const [resetPassword] = useResetPasswordMutation();
    
    const [searchParams] = useSearchParams();

    //field -> password or confirmPassword (taken with 'keyof' of PasswordVisibility)
    const togglePasswordVisibility = (field: keyof PasswordInvisibility): void => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]  // toggle/untoggle
        }))
    }

    const getFieldError = (fieldName: string) => validationErrors[fieldName];

    const onResetPasswordHandler = async(): Promise<void> => {
        try{
            const isValid = await schemaValidation();
            if(isValid){
                const token = searchParams.get('token')
                console.log("TOPKK: ", token);
                const payloadData:ResetPasswordPayloadInterface = {...userInfo, token}
                const result = await resetPassword(payloadData).unwrap();

                setResponseMessage({message: result.message});
                toast.success(`${result.message}`);
            }
        }
        catch(error){
            console.log("errorDataM", error?.data.message);
            if(error.originalStatus === 404){
                const errorMessage = error?.message || 'An unknown error occurred'
                setResponseMessage({error: errorMessage});
                toast.error(`${errorMessage}`);
            }
        }
    }

    return (
        <div className='w-full h-full py-28 bg-cover bg-center'
            style={{
                backgroundImage: `url(${BackGroundImage})`
            }}>

            {/* Here based on clicked 'forogtPassword' or not display different div context 
            by default is "SignIn Div container, if the 'forgotpasswrod" is click then "Reset Your Password" */}
            <div className='
                px-4 pt-3 pb-16 flex flex-col text-sm justify-center mx-auto bg-authPart w-[95%] max-w-[430px] rounded-xl 
                xs:px-6 
            '>    

                <h3 className='font-bold text-base text-center font-poppins mb-4 lg:text-lg'>Enter New Password</h3>

                <div className='text-center font-lato lg:text-base'>
                    To reset your password, just enter your email and a reset link will be sent to you.
                </div>

                {(responseMessage.message || responseMessage.error) &&
                    <div
                        className={`w-[90%] lg:w-[80%] mx-auto mt-8 p-3 rounded-md font-semibold text-md text-center ${responseMessage.message
                            ? 'bg-green9 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {responseMessage.message || responseMessage.error}
                    </div>
                }


                <div className='w-full flex flex-col py-1'>
                    <label className='my-1'>Password</label>

                    <div className='relative'>
                        <div className='absolute right-0 transform top-2.5 pr-3 text-2xl cursor-pointer '>
                            {showPassword.password 
                                ?
                                <FaRegEyeSlash className="text-black" onClick={() => togglePasswordVisibility('password')} />
                                :
                                <FaRegEye className="text-greyC" onClick={() => togglePasswordVisibility('password')} />
                            }
                        </div>

                        <TextField
                            className={`
                                w-full p-2 pl-4 border-2 border-greyB rounded-md
                                ${getFieldError('password') && 'border-0 border-b-4 border-red-400' }
                            `}
                            id='password'
                            name='password'
                            type={showPassword.password ? 'text' : 'password'}
                            placeholder='Enter Your password'
                            value={userInfo.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                                setUserInfo({ ...userInfo, password: e.target.value})
                            }}
                        />
                        {getFieldError('password') &&
                        <label className='text-red-600'> {getFieldError('password')}</label>
                        }
                    </div>
                </div>

                <div className='w-full flex flex-col py-1'>
                    <label className='my-1'>Confirm Password</label>

                    <div className='relative'>
                        <div className='absolute right-0 transform top-2.5 pr-3 text-2xl cursor-pointer '>
                            {showPassword.confirmPassword 
                                ?
                                <FaRegEyeSlash className="text-black" onClick={() => togglePasswordVisibility('confirmPassword')} />
                                :
                                <FaRegEye className="text-greyC" onClick={() => togglePasswordVisibility('confirmPassword')} />
                            }
                        </div>

                        <TextField
                            className={`
                                w-full p-2 pl-4 border-2 border-greyB rounded-md
                                ${getFieldError('confirmPassword') && 'border-0 border-b-4 border-red-400' }
                            `}
                            id='confirmPassword'
                            name='confirmPassword'
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            placeholder='Repeat Your password'
                            value={userInfo.confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                                setUserInfo({ ...userInfo, confirmPassword: e.target.value})
                            }}
                        />
                        {getFieldError('password') &&
                        <label className='text-red-600'> {getFieldError('confirmPassword')}</label>
                        }
                    </div>
                </div>
                

                <button 
                    className="w-full bg-green5 p-2 mt-8 font-poppins font-semibold text-white rounded-sm hover:bg-green6"
                    onClick={onResetPasswordHandler}
                >
                    Confirm
                </button>
            </div>  
        </div>
    )
}

export default ResetPassword;