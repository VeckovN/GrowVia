import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProfileDropdownProps } from '../interfaces';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../auth/auth.service';
import { removeUserFromSessionStorage } from '../utils/utilsFunctions';
import { clearAuth } from '../../auth/auth.reducers';
import { toast } from 'react-hot-toast';

const ProfileDropdown: FC<ProfileDropdownProps> = ({ authUser, closeProfileDropdown }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();

    const logoutHanlder = async (): Promise<void> => {
        try {
            await logout();
            dispatch(clearAuth());
            removeUserFromSessionStorage();
            toast.success("You're logged out");
            navigate('/signin');
        }
        catch (error) {
            console.log("Logout error:");
        }
    }

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
                    <li className='w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                        <Link
                            //customer/account or farmer/customer 
                            to={`/farmer `}
                            onClick={closeProfileDropdown}
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li className='w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                        <Link
                            //customer/account or farmer/customer 
                            to={`/farmer/profile`}
                            onClick={closeProfileDropdown}
                        >
                            Profile
                        </Link>
                    </li>

                    <li className='w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                        <Link
                            //customer/account or farmer/customer 
                            to={`/farmer/products`}
                            onClick={closeProfileDropdown}
                        >
                            Products
                        </Link>
                    </li>

                    <li className='w-full p-2 px-3 disabled text-gray-300'>
                        <Link
                            //customer/account or farmer/customer 
                            to={`/farmer/products `}
                            onClick={closeProfileDropdown}
                        >
                            Iot Management
                        </Link>
                    </li>
                </>
                :
                //not farmer -> its customer
                <li className='w-full p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                    <Link
                        //customer/account or farmer/customer 
                        to={`/${authUser.userType}/profile `}
                        onClick={closeProfileDropdown}
                    >
                        Account
                    </Link>
                </li>

                }
                
                <li className='p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                    <Link
                        to={`/${authUser.userType}/orders `}
                        onClick={closeProfileDropdown}
                    >
                        Orders
                    </Link>
                </li>

                <li className='p-2 px-3 hover:bg-gray-100 transition-colors duration-200'>
                    <Link
                        to={`/${authUser.userType}/settings `}
                        onClick={closeProfileDropdown}
                    > 
                        Settings
                    </Link>
                </li>
            </ul>

            <div
                className='p-2 px-3 rounded-b-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
                onClick={logoutHanlder}
            >
                Logout
            </div>
        </div>
    )
}

export default ProfileDropdown