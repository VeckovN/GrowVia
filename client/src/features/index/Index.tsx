import {FC, ReactElement } from 'react';

import WelcomeMessage from './WelcomeMessage';
import ShopCategories from './ShopCategories';
// import SuggestedProducts from './'
import SuggestedFarmers from './SuggestedFarmers';
import MarketMessage from './MarketMessage';

const Index: FC = (): ReactElement => {
    return( 
    <div className='bg-warning'>
        {/* <Header/> context depends on auth user (guest/customer)*/}
        <WelcomeMessage/> 
        <ShopCategories/>
        {/* <SuggestedProducts/> this is shared -> used in couple pages */}
        <SuggestedFarmers/>
        <MarketMessage/>

        {/* <Footer/> */}
    
    </div>
    )
}

export default Index;
