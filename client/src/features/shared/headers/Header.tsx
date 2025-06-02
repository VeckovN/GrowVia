import {FC, ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { HeaderInterface } from '../interfaces';
import  HeaderIconBadge  from "./HeaderIconBadge";

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import Cart from '../../../assets/header/ShoppingCart.svg';
import User from '../../../assets/header/User.svg';
import Bell from '../../../assets/header/Bell.svg';
import Heart from '../../../assets/header/Heart.svg';
import CustomerTestIcon from '../../../assets/header/CustomerTest.svg';

import Search from './Search';


const Header: FC<HeaderInterface> = ({userType, user}): ReactElement => {
    const isCustomer = userType == "Customer" 
    // const isVerified = user.verification; 
    const isVerified = false; 

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
                        <Search/>    
                    </div>

                    {/* Icons  */}
                    <div className={`flex justify-center items-center xs:gap-4 lg:gap-5 ${!isCustomer && 'gap-2'}`}>
                        
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
                                onClick={() => alert("User Badge")}
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
                                // text={user.username}
                                text="Nveckov"
                                textClassName='md:flex'
                                onClick={() => alert("Avatar Icon Badge")}
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
                    </div>
                </div>

                {/* Not Mobile View -> Links */}
                <div className='hidden sm:flex sm:items-center sm:h-16 sm:gap-6 sm:px-5'>
                        <NavLink
                            className={({ isActive }) =>
                                `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green10 transition-colors duration-200 ${
                                isActive ? 'bg-green6 text-white hover:text-white' : ''
                            }`}
                            to='/'
                        >
                            Home    
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-200 ${
                                isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                            to='/market'
                        >
                            Market    
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-200 ${
                                isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                            to='/farmers'    
                        >
                            Farmers    
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `px-5 py-2 font-poppins font-medium text-md rounded-lg hover:text-green6 transition-colors duration-100 ${
                                isActive && 'bg-green6 text-white hover:text-white'
                            }`}
                            to='/aboutUs'     
                        >
                            About    
                        </NavLink>
                </div>

                {!isVerified &&
                <div className='w-full h-16 flex justify-center items-center  bg-green5'>
                    <h3 className='text-md text-white font-semibold text-center'> Verify your account to be able do orders</h3>
                </div>
                }
            </nav>
        </header>
    )
    
}

export default Header;
