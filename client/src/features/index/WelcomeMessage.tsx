import {FC, ReactElement } from 'react';
import WelcomeBGImage from '../../assets/WelcomeBGImage.jpg';

const WelcomeMessage: FC = (): ReactElement => {
    return (
        <section className='w-full min-h-[200px] sm:min-h-[300px] bg-cover bg-center flex items-center justify-center'
        style={{
            backgroundImage: `url(${WelcomeBGImage})`
        }}
        >
        <div className='font-poppins text-center text-white'>
            <div className='font-bold text-xl sm:text-3xl md:text-4xl'>
                Shop Directly from Local Farmers
            </div>
            <div className='font-bold text-xl sm:text-3xl md:text-4xl'>
                Support. Taste. Trust.
            </div>
        </div>
        
        </section>
    )
    
}

export default WelcomeMessage;
