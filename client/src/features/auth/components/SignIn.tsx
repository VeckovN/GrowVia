import { FC, ReactElement, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TextField from '../../shared/inputs/TextField';
import { useAppDispatch } from '../../../store/store';
import { setAuthUser} from '../auth.reducers';
import { saveDataToSessionStorage, mapNotificationsData } from '../../shared/utils/utilsFunctions';

import GoogleIcon from '../../../assets/google.svg';
import BackGroundImage from '../../../assets/AuthBackground.jpg';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

import { useSignInMutation } from '../auth.service';
import { SignInPayloadInterface } from '../auth.interfaces';
import { NotificationInterface } from '../../notifications/notifications.interface';
import { useSchemaValidation } from '../../shared/hooks/useSchemaValidation';
import { useLazyGetNotificationsQuery } from '../../notifications/notifications.service';
import { setNotifications } from '../../notifications/notifications.reducers';

import { signInSchema } from '../auth.schema';

const SignIn: FC = (): ReactElement => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<SignInPayloadInterface>({
        usernameOrEmail: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [actionError, setActionError] = useState('');

    const [schemaValidation, validationErrors] = useSchemaValidation({schema: signInSchema, userData});
    //other properties are (included in RTK) as 'isLoading','isSuccess','isError' status props -> status based on that 'signIn' execution
    const [signIn, { isLoading }] = useSignInMutation();

    //The skipToken on RTK could be used for auto-fetching wiht useGetNotificationsQuery
    // // const [ getNotifications, {data: notifications, error, isLoading} ] = useLazyGetNotificationsQuery(); //declarative way
    const [ getNotifications ] = useLazyGetNotificationsQuery(); //imperative

    const getFieldError = (fieldName: string) => validationErrors[fieldName];

    const onLoginHandler = async(): Promise<void> => {
        try{
            const isValid = await schemaValidation();
            if(isValid){
                const result = await signIn(userData).unwrap();
                dispatch(setAuthUser(result.user));

                const isLoggedIn = JSON.stringify(true);
                const username = JSON.stringify(result.user?.username);
                saveDataToSessionStorage(isLoggedIn, username);

                const userID = String(result.user?.id);
                const userType = result.user?.userType ?? '';

                const notificationsResult = await getNotifications(userID);
                const notifications = notificationsResult?.data?.notifications ?? [];
                const mappedNotifications:NotificationInterface[] = notifications?.map(n => mapNotificationsData(n, userType));
                dispatch(setNotifications(mappedNotifications));

                toast.success(`${result.message}`);

                if (userType === 'farmer'){
                    navigate('/farmer');
                }
                else{
                    navigate('/');
                }
            }
        }
        catch(error){
            console.log("error", error);
            console.log("errorDataM", error?.data.message);
            //signIn error catch (ApiGateway error handler ERROR)
            if(error.originalStatus === 404){
                setActionError("User not found. Please try again");
            } 
            console.log("VAL ERR: ", validationErrors);
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
                px-4 py-8 flex flex-col justify-center items-center mx-auto bg-authPart w-[95%] max-w-[420px] rounded-xl xs:px-6
                lg:mx-0 lg:ml-8 lg:items-start
            '>    
                <h3 className='font-bold text-xl'>Sign In</h3>
                
                <div className='w-full flex justify-center items-center relative mt-6 p-2 bg-greySbtn rounded-sm cursor-pointer hover:bg-gray-300'>
                    <img
                        className='w-6 h-6 absolute left-2'
                        src={GoogleIcon}
                        alt='googleIcon'
                    />
                    <div className='font-semibold'> Sign In with Google</div>
                </div>

                <div className='w-full flex items-center my-4'>
                    <div className='flex-grow h-[1px] bg-greyB'></div>
                    <span className='px-2 text-sm font-medium text-greyB'>Or</span>
                    <div className='flex-grow h-[1px] bg-greyB'></div>
                </div>

                {actionError &&
                <div className='w-full flex justify-center'>
                    <label className='text-red-600 text-md font-medium pb-2'>{actionError}</label>
                </div>
                }

                <div className='w-full flex flex-col gap-2 font-lato'>
                    <div className='w-full flex flex-col'>
                        {/* Input will have forwardRef that allows this 'parent' component to get ref to <input> in it */}
                        {/* For example if we use inputRef.current?.focus here in parrent component - it won't work without forwardRef */}
                        <label className='text-md py-1'>Username or Email</label>
                        <TextField
                            className={`
                                p-2 pl-4 border-2 border-greyB rounded-md 
                                ${(actionError || getFieldError('usernameOrEmail')) && 'border-0 border-b-4 border-red-400' }`
                            }
                            id="usernameoremail"
                            name="usernameoremail"
                            type="text"
                            placeholder='Enter username/email@gmail.com'
                            value={userData.usernameOrEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                                setUserData({ ...userData, usernameOrEmail: e.target.value})
                            }}
                        />
                        {getFieldError('usernameOrEmail') &&
                        <label className='text-red-600'> {getFieldError('usernameOrEmail')}</label>
                        }
                    </div>

                    <div className='w-full flex flex-col py-1'>
                        <label className='my-1'>Password</label>

                        <div className='relative'>
                            <div className='absolute right-0 transform top-2.5 pr-3 text-2xl cursor-pointer '>
                                {showPassword 
                                    ?
                                    <FaRegEyeSlash className="text-black" onClick={() => setShowPassword(false)} />
                                    :
                                    <FaRegEye className="text-greyC" onClick={() => setShowPassword(true)} />
                                }
                            </div>

                            <TextField
                                className={`
                                    w-full p-2 pl-4 border-2 border-greyB rounded-md
                                    ${(actionError || getFieldError('password')) && 'border-0 border-b-4 border-red-400' }
                                `}
                                id='usernamOrEmail'
                                name='usernameOrEmail'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Enter Your password'
                                value={userData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                                    setUserData({ ...userData, password: e.target.value})
                                }}
                            />
                            {getFieldError('password') &&
                            <label className='text-red-600'> {getFieldError('password')}</label>
                            }
                        </div>
                    </div>

                    <div className='flex justify-between font-inter text-sm text-gray pt-'>
                        <div className='flex gap-x-2'>
                            {/* CheckButton */}
                            <input
                                className='w-4 h-4 border-2 '
                                id='remember'
                                type='checkbox'
                            />
                            <label>Remember me</label>
                        </div>
                        <div className=''>
                            <Link
                                className='cursor-pointer hover:black'
                                to='/forgot-password'
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                   
                    <button
                        className="w-full bg-green5 p-2 mt-8 font-poppins font-semibold text-white rounded-sm hover:bg-green6"
                        onClick={onLoginHandler}
                    >
                        Sign in
                    </button>
                </div>
            </div>  
        </div>
    )
}

export default SignIn;