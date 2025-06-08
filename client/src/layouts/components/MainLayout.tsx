import Header from '../../features/shared/headers/Header';
import HeaderAuth from '../../features/shared/headers/HeaderAuth';
import Footer from '../../features/shared/footer/Footer';

import { MainLayoutPropsInterface } from '../layouts.interface';

const MainLayout = ({children, authPage}: MainLayoutPropsInterface) => {
    return (
        <div className='w-full'>
            {/* if the authPage = true  display <HeaderAuth /> if not let Header*/}
            {authPage ? (
                <HeaderAuth />
            ) : (
                <Header />
            )}
            {children}
            <Footer/>
        </div>  
    )
}

export default MainLayout;