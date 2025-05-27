import {FC, ReactElement, useState, useEffect} from 'react';
import useVisibleCount from '../../hooks/useVisibleCount';
import { SlideListInterface, productsList  } from '../utils/data';

import ProductSlide from './ProductSlide';


const ProductsSlideList: FC<SlideListInterface> = ({title}): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:3,
        tablet:2,
        desktop:5
    }) 
    
    // const [visibleCount, setVisibleCount] = useState(3); //3 - mobile default
    // useEffect(() => {
    //     let timeoutId: any;

    //     const handleResize = () => {
    //         if (typeof window === 'undefined') return;
            
    //         clearTimeout(timeoutId);
    //         timeoutId = setTimeout(() => {
    //             const width = window.innerWidth;
    //             setVisibleCount(width < 640 ? 3 : width < 1024 ? 2 : 4);
    //         }, 10);
    //     };

    //     handleResize(); // Initial call
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //         clearTimeout(timeoutId);
    //     };
    // }, []);

    return (
        <section className='container mx-auto px-7 pt-10 max-w-[400px] sm:max-w-[700px] lg:max-w-[1320px] '>

            <div className='flex justify-between px-2 items-center '>
                <div>
                    <h2 className='font-bold text-xl'> {title} </h2>
                     <div className='flex hidden sm:block'>
                        <span className='text-xl mx-2'>{'<'}</span>
                        <span className='text-xl'>{'>'}</span>
                    </div>
                </div>
                <button className='text-xs border rounded-lg border-black p-2'>All Products {'>'}</button>
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <span className='text-xl'>{'<'}</span>
            </div>


            {/* 
                on mobile view display 3 items in flex-col, 
                on Table view diplay 2 items  in flex-row
                on Larger view display 4 items in flex-row as well
            */}
            {/*max-w-[1200px] mx-auto = prevents content from stretching to wide and center it  */}
            <div className='
                grid grid-cols-1 gap-4         /* Mobile: 1 column */
                sm:grid-cols-2 sm:gap-6        /* Tablet: 2 columns */
                lg:grid-cols-4 lg:gap-2         /* Desktop: 4 columns */
            '>
                {/* {productsList.slice(0,4).map((product) => ( */}
                {productsList.slice(0, visibleCount).map((product) => (
                    <ProductSlide 
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        unit={product.unit}
                        farmerName={product.farmerName}
                        farmerLocation={product.farmerLocation}
                        price={product.price}
                        favorite={product.favorite}
                        image={product.image}
                    />
                ))}
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <span className='text-xl'>{'>'}</span>
            </div>
          
        </section>
    )
}

export default ProductsSlideList;