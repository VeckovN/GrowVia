import { FC, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import TextField from '../../shared/inputs/TextField';
import BackGroundImage from '../../../assets/AuthBackground.jpg';

const ResetPassword: FC = (): ReactElement => {

    const [userData, setUserData] = useState<{email: string}>({email: ''});

    return (
        <div className='w-full h-full py-28 bg-cover bg-center'
            style={{
                backgroundImage: `url(${BackGroundImage})`
            }}>

            {/* Here based on clicked 'forogtPassword' or not display different div context 
            by default is "SignIn Div container, if the 'forgotpasswrod" is click then "Reset Your Password" */}
            <div className='
                px-4 pt-3 pb-16 flex flex-col text-sm justify-center mx-auto bg-authPart w-[95%] max-w-[430px] rounded-xl 
                xs:px-6 lg:mx-0 lg:ml-8 
            '>    
                <div className='mb-14 text-xs lg:text-sm'>
                    <Link
                        className='font-poppins font-medium cursor-pointer hover:black'
                        to='/signin'
                    >
                        Back To Sign In 
                    </Link>
                </div>


                <h3 className='font-bold text-base text-center font-poppins mb-4 lg:text-lg'>Reset Your Password</h3>

                <div className='text-center font-lato lg:text-base'>
                    To reset your password, just enter your email and a reset link will be sent to you.
                </div>

                <div className='w-full flex flex-col pt-8'>
                    <label className='text-md py-1'>Email</label>
                    <TextField
                        className='p-2 pl-4 border-2 border-greyB rounded-md'
                        id="email"
                        name="email"
                        type="text"
                        placeholder='Enter your email address'
                        value={userData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                            setUserData({ ...userData, email: e.target.value})
                        }}
                    />
                </div>

                <button className="w-full bg-green5 p-2 mt-8 font-poppins font-semibold text-white rounded-sm hover:bg-green6">
                    Send Reset Link
                </button>
            </div>  
        </div>
    )
}

export default ResetPassword;