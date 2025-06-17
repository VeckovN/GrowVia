import { FC, ReactElement, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../store/store';
import { useResentEmailVerificationMutation } from '../../auth/auth.service';
import HeaderIconBadge from "./HeaderIconBadge";
import Search from './Search';
import ProfileDropdown from './ProfileDropdown';
import { ReduxStateInterface } from '../../../store/store.interface';
import useOnClickOutside from '../hooks/useOnClickOutside';

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import Cart from '../../../assets/header/ShoppingCart.svg';
import User from '../../../assets/header/User.svg';
import Bell from '../../../assets/header/Bell.svg';
import Heart from '../../../assets/header/Heart.svg';
import CustomerTestIcon from '../../../assets/header/CustomerTest.svg';

const Header: FC = (): ReactElement => {
    const navigate = useNavigate();
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const isCustomer: boolean = authUser.userType === 'customer';
    const isVerified = !authUser.verificationEmailToken;
    const [resentEmailVerification] = useResentEmailVerificationMutation();
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useOnClickOutside(profileDropdownRef, false);

    const toggleProfileDropdown = (): void => {
        setIsProfileOpen(!isProfileOpen);
    }

    const onResentVerification = async (): Promise<void> => {
        try {
            const result = await resentEmailVerification().unwrap();
            setIsEmailSent(true);
            toast.success(`${result.message}`);
        }
        catch (error) {
            console.log("error");
            toast.error("Resnt Email Verficication error");
        }
    }

    return (
        <header>
            <nav className='w-full h-full '>
                <div className='flex justify-between items-center h-16 px-2 py-10 sm:px-4 sm:border-b sm:border-greyB'>
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

                    <div className='w-[50%] max-w-[500px] hidden sm:flex justify-center items-center'>
                        {/* SelectCategory-SearchProduct */}
                        <Search />
                    </div>

                    {/* Icons  */}
                    <div className={`relative flex justify-center items-center xs:gap-4 lg:gap-5 ${!isCustomer && 'gap-2'}`}>
                        {!isCustomer ?
                            <>
                                <HeaderIconBadge
                                    icon={Cart}
                                    alt="cart"
                                    content="3"
                                    text="MyCart"
                                    textClassName='md:flex'
                                    onClick={() => alert("Cart Badge")}
                                />
                                <HeaderIconBadge
                                    icon={User}
                                    alt="user"
                                    text="Signup/Signin"
                                    textClassName='xs:flex'
                                    onClick={() => navigate('/signin')}
                                />
                            </>
                            :
                            <>
                                <HeaderIconBadge
                                    icon={Cart}
                                    alt="cart"
                                    content="3"
                                    textClassName='md:flex'
                                    onClick={() => alert("Cart Badge")}
                                />
                                <HeaderIconBadge
                                    icon={Bell}
                                    alt="notifications"
                                    content='5'
                                    onClick={() => alert("User Notifications")}
                                />
                                <HeaderIconBadge
                                    icon={Heart}
                                    alt="heart"
                                    onClick={() => alert("User Favorite")}
                                />
                                <HeaderIconBadge
                                    icon={CustomerTestIcon}
                                    alt="avatar"
                                    text={authUser.username}
                                    textClassName='md:flex'
                                    onClick={toggleProfileDropdown}
                                />
                            </>
                        }

                        <div className='flex w-30 h-30 sm:hidden'>
                            <button className="flex flex-col justify-center items-center pointer-cursor">
                                <span className=" h-0.5 w-6 m-[3px]  block border-b border-greyB"></span>
                                <span className=" h-0.5 w-6 m-[3px]  block border-b border-greyB"></span>
                                <span className=" h-0.5 w-6 m-[3px]  block border-b border-greyB"></span>
                            </button>
                        </div>

                        {isProfileOpen &&
                            <div ref={profileDropdownRef} className='absolute top-10'>
                                <ProfileDropdown authUser={authUser} />
                            </div>
                        }
                    </div>
                </div>

                {/* Not Mobile View -> Links */}
                <div className='hidden sm:flex sm:items-center sm:h-16 sm:gap-6 sm:px-5'>
                    <NavLink
                        className={({ isActive }) =>
                            `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green10 transition-colors duration-200 ${isActive ? 'bg-green6 text-white hover:text-white' : ''
                            }`}
                        to='/'
                    >
                        Home
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-200 ${isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                        to='/market'
                    >
                        Market
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-200 ${isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                        to='/farmers'
                    >
                        Farmers
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-100 ${isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                        to='/aboutUs'
                    >
                        About
                    </NavLink>
                </div>

                {!isVerified && (
                    <div className='w-full h-16 flex justify-center items-center bg-yellowVerification'>
                        {isEmailSent
                            ? (
                                <span className='text-gray-800 cursor-default font-bold'>
                                    Verification email sent! Check your email
                                </span>
                            ) : (
                                <button
                                    onClick={onResentVerification}
                                    className='text-md text-white font-semibold text-center cursor-pointer hover:font-bold hover:text-gray-600'
                                >
                                    Verify your account to be able to order. Here
                                </button>
                            )}
                    </div>
                )}
            </nav>
        </header>
    )

}

export default Header;
