import {FC, ReactElement } from 'react';
import { productCategories } from '../shared/utils/data';
// import { v4 as uuidv4 } from 'uuid';

import CategoryItem from '../index/CategoryItem';

const ShopCategories: FC = (): ReactElement => {
    return (
        <section className='bg-white pt-10'>
            <h2 className='pb-5 font-bold text-xl text-center sm:text-2xl'>
                Shop Category
            </h2>

            <div className='flex py-3 items-center justify-center '>

                <div className='px-2 text-2xl hover:text-3xl'> 
                    {'<'}
                </div>

                <div className='flex overflow-hidden max-w-full  space-x-2'>
                {productCategories.map((category) => (
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
