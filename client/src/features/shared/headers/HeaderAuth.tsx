import { FC, ReactElement } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoIcon from '../../../assets/header/LogoIcon.svg';

const HeaderAuth: FC = (): ReactElement => {
    //Sign-up context now only appears on the sign-in page
    const navigate = useNavigate();
    const location = useLocation();
    const isSignIn = location.pathname === '/signin';

    return (
        <header>
            <nav className='w-full h-full '>
                <div className='
                    flex justify-between flex-col items-center py-3 border-b border-greyB
                    sm:flex-row sm:h-16 sm:px-2 sm:py-10 sm:px-4 
                '>
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

                    <div className='flex text-center py-2 sm:pr-2 font-poppins font-medium'>
                        {isSignIn
                            ?
                            <div>Start your journey with us. <span className='text-green6 font-semibold cursor-pointer hover:text-green7' onClick={() => navigate('/signup')}>Sign up</span></div>
                            :
                            <div>Welcome back! <span className='text-green6 font-semibold cursor-pointer hover:text-green7' onClick={() => navigate('/signin')}>Sign in</span> to your account</div>
                        }
                    </div>
                </div>

            </nav>
        </header>
    )
}

export default HeaderAuth;