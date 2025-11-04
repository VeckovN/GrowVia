import { FC, ReactElement, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../store/store';
import { useResentEmailVerificationMutation } from '../../auth/auth.service';
import { ReduxStateInterface } from '../../../store/store.interface';
import HeaderIconBadge from "./HeaderIconBadge";
import Search from './Search';
import ProfileDropdown from './ProfileDropdown';
import NotificationsDropdown from '../../notifications/components/NotificationsDropdown';
import CartDropdown from '../../cart/components/CartDropdown';
import useOnClickOutside from '../hooks/useOnClickOutside';
import useNotificationsDropdown from '../hooks/useNotificationsDropdown';

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import Cart from '../../../assets/header/ShoppingCart.svg';
import User from '../../../assets/header/User.svg';
import Bell from '../../../assets/header/Bell.svg';
import Heart from '../../../assets/header/Heart.svg';
import CustomerTestIcon from '../../../assets/header/CustomerTest.svg';

const Header: FC = (): ReactElement => {
    const navigate = useNavigate();
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const cart = useAppSelector((state: ReduxStateInterface) => state.cart)
    const notifications = useAppSelector((state: ReduxStateInterface) => state.notifications);

    const isCustomer: boolean = authUser.userType === 'customer';
    const isVerified = !authUser.verificationEmailToken;
    const [resentEmailVerification] = useResentEmailVerificationMutation();
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const cartDropdownRef = useRef<HTMLDivElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useOnClickOutside(profileDropdownRef, false);
    const [isCartOpen, setIsCartOpen] = useOnClickOutside(cartDropdownRef, false);
    const { notificationsDropwdownRef, isNotificationsOpen, toggleNotificationsDropdown} = useNotificationsDropdown();

    const cartData = cart?.data ?? [];
    const totalQuantity = cartData.reduce((total, group) => {
        return total + group.products.reduce((sum, product) => sum + product.quantity, 0);
    }, 0)
    
    useEffect(() => {
        if (isCartOpen) {
            const originalStyle = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => { 
                document.body.style.overflow = originalStyle
            }
        }
    }, [isCartOpen])

    const toggleProfileDropdown = (): void => {
        setIsProfileOpen(!isProfileOpen);
    }

    const toggleCartDropdown = ():void => {
        setIsCartOpen(!isCartOpen);        
    }

    const closeProfileDropdown = ():void =>{
        setIsProfileOpen(false);
    }

    const onCloseCartDropdown = ():void => {
        setIsCartOpen(false);
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
                        <HeaderIconBadge
                            icon={Cart}
                            alt="cart"
                            content={totalQuantity}
                            textClassName='md:flex'
                            onClick={toggleCartDropdown}
                        />
                        {!isCustomer ?
                            <>
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
                                    icon={Bell}
                                    alt="notifications"
                                    content={notifications?.unreadCount ?? 0}
                                    onClick={toggleNotificationsDropdown}
                                />
                                <HeaderIconBadge
                                    icon={Heart}
                                    alt="heart"
                                    content={authUser.wishlist?.length ?? 0}
                                    // onClick={toggleWishlistDropdown}
                                    onClick={() => alert("User Favorite")}
                                />
                                <HeaderIconBadge
                                    icon={authUser.profileAvatar?.url || CustomerTestIcon}
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
                                <ProfileDropdown authUser={authUser} closeProfileDropdown={closeProfileDropdown}/>
                            </div>
                        }

                        {isNotificationsOpen &&
                            <div ref={notificationsDropwdownRef} className='w-full absolute top-10 z-20'>
                                <NotificationsDropdown 
                                    notifications={notifications.list}
                                    unreadCount={notifications.unreadCount}
                                />
                            </div>
                        }

                        {isCartOpen && 
                            <div className={`
                                fixed inset-0 z-40 bg-black/50`}>
                                <div 
                                    ref={cartDropdownRef} 
                                    className={`
                                        flex fixed top-0 right-0  h-screen w-screen bg-white  
                                        sm:w-[80%] md:w-[60%]a max-w-[550px] overflow-y-auto z-50
                                    `}>
                                    <CartDropdown
                                        isCustomer={isCustomer} 
                                        cart={cartData} 
                                        closeCartDropdown={onCloseCartDropdown}
                                    />
                                </div>
                            </div>
                        }

                    </div>
                </div>

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
