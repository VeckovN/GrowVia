import {FC, ReactElement } from 'react';
import { useGetNewestProductsQuery } from '../product/product.service';

import WelcomeMessage from './WelcomeMessage';
import ShopCategories from './categories/ShopCategories';
import SuggestedFarmers from './farmers/SuggestedFarmers';
import MarketMessage from './marketplaceMessage/MarketMessage';
import ProductsSlideList from '../shared/productsList/ProductsSlideList';


const Index: FC = (): ReactElement => {
    //Get productData here
    const {data:productsData, isLoading: isProductLoading, refetch} = useGetNewestProductsQuery('8');

    console.log("productsData: ", productsData);

    return( 
    <div className='w-full'>
        <WelcomeMessage/> 
        <ShopCategories/>
        <div className='px-7'>
            <ProductsSlideList
                title="Products"
                data={productsData?.products ?? []}
                isLoading={isProductLoading}
            />
        </div>
        <div className='px-7'>
            <SuggestedFarmers
                title="Farmers"
            />
        </div>
        <MarketMessage/>
    </div>
    )
}

export default Index;
