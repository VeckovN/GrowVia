import {FC, ReactElement } from 'react';

import WelcomeMessage from './WelcomeMessage';
import ShopCategories from './categories/ShopCategories';
import SuggestedFarmers from './farmers/SuggestedFarmers';
import MarketMessage from './marketplaceMessage/MarketMessage';
import ProductsSlideList from '../shared/productsList/ProductsSlideList';

const Index: FC = (): ReactElement => {
    return( 
    <div className='w-full'>
        <WelcomeMessage/> 
        <ShopCategories/>
        <ProductsSlideList
            title="Products"
        />
        <SuggestedFarmers
            title="Farmers"
        />
        <MarketMessage/>
    </div>
    )
}

export default Index;
