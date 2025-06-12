import { FC, ReactElement, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';
import { useAppDispatch } from '../../../store/store';
import { useVerifyEmailMutation } from '../auth.service';
import { ReduxStateInterface } from '../../../store/store.interface';
import { verifyUserEmail } from '../auth.reducers';

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import { FaSpinner } from 'react-icons/fa';

const ConfirmEmail: FC = (): ReactElement => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state:ReduxStateInterface) => state.authUser) 
    const [responseMessage, setResponseMessage] = useState<{message?:string, error?:string}>({error:'An unknown error occurred'});
    const [isVerifying, setIsVerifying] = useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const [verifyEmail] = useVerifyEmailMutation();

    const onVerifyEmail = async():Promise<void> => {
        console.log("onVerificationEmail");
        try{
            const token = searchParams.get('token');
            if(!token){
                setResponseMessage({error: 'Missing verification token'})
                setIsVerifying(false);
                return
            }
            const result = await verifyEmail({userID: authUser.id, token}).unwrap();
            dispatch(verifyUserEmail());
            setResponseMessage({message: result.message});
        }
        catch (error) {
            console.log("errorDataM", error?.data.message);
            if(error.originalStatus === 404){
                const errorMessage = error?.message || 'An unknown error occurred'
                setResponseMessage({error: errorMessage});
            }
        }
        setIsVerifying(false);
    }

    useEffect(() =>{
        onVerifyEmail
    },[])
   
    return (
        <div className='w-full h-full p-2 '>
            <div className='flex items-center'>
                <img
                    className='w-8 h-8'
                    src={LogoIcon}
                    alt='logo'
                />
                <div className=''>
                    <Link
                        className='font-poppins font-medium text-xl pl-2 '
                        to='/'
                    >
                        Growvia    
                    </Link>
                </div>
            </div>
            
            <div className='mt-10 flex justify-center items-center flex-col '>

                <div className='flex justify-center'>
                    {isVerifying 
                    ?
                    <div className='py-4 px-4 bg-gray-400 flex items-center flex-cols'>
                        {/* HERE I WANT LAADING CIRCLE ICON WITH ANIMATIONS */}
                        <FaSpinner className='h-8 w-8 text-green9 animate-spin'/> 
                        <div className='ml-2 bg-gray-400 font-meidum'> Verifying your email... </div> 
                        
                    </div>
                    :
                    <div className='border-2 rounded'>
                        {responseMessage.error &&
                        <div className='p-4 bg-red-400 text-white text-md font-semibold'>
                            <span>{responseMessage.error}</span> 
                        </div>
                        }
                        {responseMessage.message &&
                        <div className='p-4 bg-green5 text-white text-md font-semibold'>
                            <span>{responseMessage.message}</span>
                        </div>
                        }
                    </div>
                }
                </div>

                <Link
                    className='p-2 mt-4 w-[150px] bg-green6 text-center rounded-md text-sm font-semibold '
                    to='/'
                >
                    Go back on App    
                </Link>
 
            </div>

        </div>
    )
}

export default ConfirmEmail;