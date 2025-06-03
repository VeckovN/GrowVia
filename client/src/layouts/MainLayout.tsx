import {ReactNode } from 'react';

import { CustomerAuthInterface } from '../features/shared/interfaces';
import Header from '../features/shared/headers/Header';
import Footer from '../features/shared/footer/Footer';

const MainLayout = ({children}: {children: ReactNode}) => {
const userType:string ='Customer'
    const user: CustomerAuthInterface | null = null;

    return (
        <div className='w-full'>
            <Header userType={userType} user={user}/>
            {children}
            <Footer/>
        </div>  
    )
}

export default MainLayout;