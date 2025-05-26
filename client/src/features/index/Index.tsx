import {FC, ReactElement } from 'react';

import WelcomeMessage from './WelcomeMessage';
import ShopCategories from './ShopCategories';
import MarketMessage from './MarketMessage';

const Index: FC = (): ReactElement => {
    return( 
    <div className=''>
        {/* <Header/> context depends on auth user (guest/customer)*/}
        <WelcomeMessage/> 
        <ShopCategories/>
        <MarketMessage/>

        {/* <Footer/> */}
    
    </div>
    )
}

export default Index;
