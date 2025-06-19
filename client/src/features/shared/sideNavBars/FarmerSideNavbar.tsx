import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import HeaderIconBadge from '../headers/HeaderIconBadge';

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import Bell from '../../../assets/header/Bell.svg'

import HomeIcon from '../../../assets/navBar/Home.svg';
import ProfileIcon from '../../../assets/navBar/Profile.svg';
import ProductIcon from '../../../assets/navBar/Products.svg';
import OrdersIcon from '../../../assets/navBar/Orders.svg';
import SettingsIcon from '../../../assets/navBar/Settings.svg';
import LockerIcon from '../../../assets/navBar/Locker.svg';

const FarmerSideNavbar:FC = () => {

    return (
        <nav className='w-[270px] bg-white'>
            <div className='flex items-center py-4 relative'>
                <img
                    className='w-8 h-8'
                    src={LogoIcon}
                    alt='logo'
                />
                <h2 className='font-poppins font-medium text-xl pl-2'>
                    Growvia
                </h2>

                <div className='absolute right-2'>
                    <HeaderIconBadge
                        icon={Bell}
                        alt="notifications"
                        content='5'
                        onClick={() => alert("User Notifications")}
                    />
                </div>
            </div>
            <ul className='w-full'>
                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        end //ensure that the link is only considered active that matches exactly '/farmer/ (not just starts with '/farmer')
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green1 transition-colors duration-200 hover:font-medium 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold' : ''
                            
                        }`}
                        to='/farmer'
                    >
                        <img
                            className='w-4 h-4'
                            src={HomeIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Dashboard </span>
                    </NavLink>
                </li>
                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green1 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/farmer/profile'
                    >
                        <img
                            className='w-4 h-4'
                            src={ProfileIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Profile </span>
                    </NavLink>
                </li>

                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/farmer/products'
                    >
                        <img
                            className='w-4 h-4'
                            src={ProductIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Products </span>
                    </NavLink>
                </li>

                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/farmer/orders'
                    >
                        <img
                            className='w-4 h-4'
                            src={OrdersIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Orders </span>
                    </NavLink>
                </li>

                <li className='w-full cursor-defult'>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 text-gray-400
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/farmer/iot'
                    >
                        <img
                            className='w-4 h-4 '
                            src={HomeIcon}
                            alt='logo'
                        />
                        <div className='relative w-full flex items-center text-green10 pl-2 text-gray-400'> Iot Management <span className='absolute right-3'> <img className='w-4 h-4' src={LockerIcon} alt='locker'/> </span></div>
                    </NavLink>
                </li>
                    
                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/farmer/settings'
                    >
                        <img
                            className='w-4 h-4'
                            src={SettingsIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Settings </span>
                    </NavLink>
                </li>


               <li className='w-full mt-10 cursor-pointer'>
                    <div className='flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200'>
                        <img
                            className='w-4 h-4 '
                            src={HomeIcon}
                            alt='logo'
                        />
                        <div className='relative w-full flex items-center text-green10 pl-2 '> SignOut </div>
                    </div>
                </li>
            
            </ul>
        </nav>  
    )
}

export default FarmerSideNavbar