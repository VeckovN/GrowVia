import { FarmerLayoutPropsInterface } from '../layouts.interface';
import Footer from '../../features/shared/footer/Footer';
import CustomerSideNavbar from '../../features/shared/sideNavBars/CustomerSideNavbar';

const CustomerLayout = ({children}: FarmerLayoutPropsInterface ) => {

    return (
        <div className='w-full bg-white'>
            <div className='flex mt-10 mx-7 my-3 sm:mx-7  mb-20'>
                <div className='hidden lg:block '>
                    <CustomerSideNavbar />
                </div> 

                <aside className='w-full flex lg:flex-row flex-col'>
                    <div className='hidden h-full w-[2px] mx-4 bg-greyB lg:block'> </div>
                    <div className='w-full'>{children}</div>
                </aside>
            </div>
            
            <Footer />
        </div>
    )
}

export default CustomerLayout;