import { FarmerLayoutPropsInterface } from '../layouts.interface';
import Footer from '../../features/shared/footer/Footer';
import FarmerSideNavbar from '../../features/shared/sideNavBars/FarmerSideNavbar';
import FarmerHeader from '../../features/shared/headers/FarmerHeader';

const FarmerLayout = ({children}: FarmerLayoutPropsInterface ) => {

    return (
        <div className='w-full'>
            <div className='lg:invisible top right '>
                <FarmerHeader />
            </div>

            <div className='flex mx-7 my-3 sm:mx-7  mb-20'>
                <div className='hidden lg:block '>
                    <FarmerSideNavbar />
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

export default FarmerLayout;