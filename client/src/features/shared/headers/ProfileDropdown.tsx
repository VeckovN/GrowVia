import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ProfileDropdownProps } from '../interfaces';

import useLogout from '../hooks/useLogout';

const ProfileDropdown: FC<ProfileDropdownProps> = ({ authUser, closeProfileDropdown }) => {
    const logoutHandler = useLogout()

    return (
        <div className='bg-white border border-greyB rounded-xl'>
            <div className='p-3 '>
                <div className=''> {authUser.userType.charAt(0).toUpperCase() + authUser.userType.slice(1).toLowerCase()}
                    <span className='font-semibold'> {authUser.fullName}</span>
                </div>
                <p className='pt-1 text-xs'>{authUser.email}</p>
            </div>

            <ul className='w-full border-y border-greyB flex flex-col cursor-pointer'>

                { authUser.userType === 'farmer' ?
                <>
                    <li className="w-full">
                        <Link
                            className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200"
                            to="/farmer"
                            onClick={closeProfileDropdown}
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li className="w-full">
                        <Link
                            to="/farmer/profile"
                            onClick={closeProfileDropdown}
                            className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Profile
                        </Link>
                    </li>

                    <li className='w-full '>
                        <Link
                            className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200" 
                            to={`/farmer/products`}
                            onClick={closeProfileDropdown}
                        >
                            Products
                        </Link>
                    </li>

                    {/* <li className='w-full'>
                        <Link
                            className="block w-full p-2 px-3 text-gray-300 cursor-default transition-colors duration-200" 
                            to={`/farmer/iot `}
                            onClick={closeProfileDropdown}
                        >
                            Iot Management
                        </Link>
                    </li> */}
                    <li className="w-full">
                        <span className="block w-full p-2 px-3 text-gray-300 cursor-default transition-colors duration-200">
                            IoT Management
                        </span>
                    </li>
                </>
                :
                //not farmer -> its customer
                <li className='w-full'>
                    <Link
                        className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200" 
                        to={`/${authUser.userType}/profile `}
                        onClick={closeProfileDropdown}
                    >
                        Account
                    </Link>
                </li>

                }
                
                <li className='w-full'>
                    <Link
                        className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200" 
                        to={`/${authUser.userType}/orders `}
                        onClick={closeProfileDropdown}
                    >
                        Orders
                    </Link>
                </li>

                <li className='w-full'>
                    <Link
                        className="block w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200" 
                        to={`/${authUser.userType}/settings `}
                        onClick={closeProfileDropdown}
                    > 
                        Settings
                    </Link>
                </li>
            </ul>

            <div
                className='p-2 px-3 rounded-b-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
                onClick={logoutHandler}
            >
                Logout
            </div>
        </div>
    )
}

export default ProfileDropdown