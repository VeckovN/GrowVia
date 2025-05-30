import {FC, ReactElement } from 'react';

import MarketplaceItemInfo from './MarketplaceItemInfo';

import partnershipIcon from "../../../assets/marketplaceinfo/business-partnership.svg";
import successIcon from "../../../assets/marketplaceinfo/business-success.svg";
import wateringCanIcon from "../../../assets/marketplaceinfo/watering-can.svg";
import moneyGrowthIcon from "../../../assets/marketplaceinfo/money-growth.svg";


const MarketMessage: FC = (): ReactElement => {
    return (
        <section className='container mx-auto h-full px-7  p-20 max-w-[400px] sm:max-w-[900px] lg:max-w-[1320px] '>           
            
            <div className="flex justify-center items-center">
                <div className='font-poppins text-2xl lg:text-3xl text-center'>Why Our Marketplace Matters</div>
            </div>

            <div className='
                max-w-[500px] w-full mx-auto  
                sm:max-w-[900px] sm:grid sm:grid-cols-2 sm:gap-y-6 sm:gap-x-4 
            '>
                <div className='mt-6 h-full'>
                    <MarketplaceItemInfo
                        title='Together, We Grow'
                        description='A marketplace built for real people — supporting farmers and serving customers with purpose.'
                        icon={partnershipIcon}
                    />
                </div>
                <div className='mt-6 h-full'>
                    <MarketplaceItemInfo
                        title='A Better Way to Buy and Sell'
                        description='Connecting communities, supporting local food systems, and making quality accessible.'
                        icon={successIcon}
                    />
                </div>

                <div className='mt-6 h-full'>
                    <MarketplaceItemInfo
                        title='Farm to Table, Powered by You'
                        description='Bringing local farmers and conscious customers together for something greater.'
                        icon={wateringCanIcon}
                    />
                </div>

                <div className='mt-6 h-full'>
                    <MarketplaceItemInfo
                        title='Empowering Local Economies'
                        description='Support small-scale farmers and local businesses while helping your community thrive.'
                        icon={moneyGrowthIcon}
                    />
                </div>
            </div>
        

            
        </section>
    )
    
}

export default MarketMessage;
