import { FC, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';
import { ReduxStateInterface } from '../../../store/store.interface';
import HeaderIconBadge from './HeaderIconBadge';
import useOnClickOutside from '../hooks/useOnClickOutside';
import ProfileDropdown from './ProfileDropdown';

import LogoIcon from '../../../assets/header/LogoIcon.svg';
import Bell from '../../../assets/header/Bell.svg';
import CustomerTestIcon from '../../../assets/header/CustomerTest.svg';

const FarmerHeader:FC = () => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useOnClickOutside(profileDropdownRef, false);
    
    const toggleProfileDropdown = (): void => {
        setIsProfileOpen(!isProfileOpen);
    }
    
    const closeProfileDropdown = ():void =>{
        setIsProfileOpen(false);
    }

    return (
        <header className='w-full bg-red-100 flex justify-between items-center h-14 px-2 py-9'>
            <div className='flex items-center relative'>
                <img
                    className='w-8 h-8'
                    src={LogoIcon}
                    alt='logo'
                />
                <div className=''>
                    <Link
                        className='font-poppins font-medium text-xl pl-2 '
                        to='/farmer'
                    >
                        Growvia
                    </Link>
                </div>
            </div>

            <div className={`relative flex justify-center items-center px-10 xs:gap-4 lg:gap-5`}>
                <HeaderIconBadge
                    icon={Bell}
                    alt="notifications"
                    content='5'
                    onClick={() => alert("User Notifications")}
                />

                <HeaderIconBadge
                    icon={CustomerTestIcon}
                    alt="avatar"
                    text={authUser.username}
                    textClassName='md:flex'
                    hiddenText={false}
                    onClick={toggleProfileDropdown}
                />

                {isProfileOpen &&
                    <div ref={profileDropdownRef} className='absolute top-10'>
                        <ProfileDropdown authUser={authUser} closeProfileDropdown={closeProfileDropdown} />
                    </div>
                 }
            </div>
        </header>
    )
}

export default FarmerHeader;