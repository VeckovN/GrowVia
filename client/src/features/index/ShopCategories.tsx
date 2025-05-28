import {FC, ReactElement } from 'react';
import { productCategories } from '../shared/utils/data';
// import { v4 as uuidv4 } from 'uuid';
import useVisibleCount from '../hooks/useVisibleCount';

import CategoryItem from '../index/CategoryItem';

const ShopCategories: FC = (): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:2,
        tablet:4,
        desktop:7
    }) 

    return (
        <section className='pt-10'>
            <h2 className='pb-5 font-bold text-xl text-center sm:text-2xl'>
                Shop Category
            </h2>

            <div className='flex py-3 items-center justify-center '>

                <div className='px-2 text-2xl hover:text-3xl'> 
                    {'<'}
                </div>

                <div className='flex overflow-hidden max-w-full  space-x-2'>
                {productCategories.slice(0, visibleCount).map((category) => (
                    <CategoryItem 
                        id = {category.id}
                        name = {category.name}
                        icon = {category.icon}
                    />
                ))}
                </div>

                <div className='px-2 text-2xl bold'> 
                    {'>'}
                </div>

            </div>
        </section>
    )
    
}

export default ShopCategories;
