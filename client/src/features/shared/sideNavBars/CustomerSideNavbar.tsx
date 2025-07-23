import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import ProfileIcon from '../../../assets/navBar/Profile.svg';
import OrdersIcon from '../../../assets/navBar/Orders.svg';
import HearthIcon from '../../../assets/navBar/Heart.svg';
import SettingsIcon from '../../../assets/navBar/Settings.svg';
import LogoutIcon from '../../../assets/navBar/Logout.svg';

const CustomerSideNavbar:FC = () => {
    return (
        <nav className='w-[270px] bg-white'>
            <ul className='w-full'>
                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green1 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/customer/profile'
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
                        to='/customer/orders'
                    >
                        <img
                            className='w-4 h-4'
                            src={OrdersIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Orders </span>
                    </NavLink>
                </li>

                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/customer/wishlist'
                    >
                        <img
                            className='w-4 h-4'
                            src={HearthIcon}
                            alt='logo'
                        />
                        <span className='text-green10 pl-2'> Wishlist </span>
                    </NavLink>
                </li>

                    
                <li className='w-full transition-colors duration-200 '>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center w-full h-12 p-2 px-4 hover:bg-green2 transition-colors duration-200 
                            ${isActive ? 'bg-green3 hover:bg-green2 font-semibold ' : ''
                            
                        }`}
                        to='/customer/settings'
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
                            src={LogoutIcon}
                            alt='logo'
                        />
                        <div className='relative w-full flex items-center text-green10 pl-2 '> SignOut </div>
                    </div>
                </li>
            
            </ul>
        </nav>  
    )
}

export default CustomerSideNavbar