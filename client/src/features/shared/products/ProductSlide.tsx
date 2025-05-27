import {FC, ReactElement } from 'react';
import { ProductItemInterface } from '../utils/data';

const ProductSlide: FC<ProductItemInterface> = ({
    id, 
    name, 
    category,
    unit,
    farmerName,
    farmerLocation,
    price,
    favorite,
    image
}): ReactElement => {
    return (
        <div key={id} className='flex flex-col my-4 justify-center items-center border-2 border-black rounded-lg sm:w-full sm:max-w-[320px] lg:mx-1'>
            <div className='w-full h-[170px] sm:h- bg-cover bg-center'
                style={{backgroundImage: `url(${image})`}}>
            </div>

            {/* put h-5 to make enought space between this div and second   */}
            <div className='relative w-full h-7 px-3 mt-2 text-md'>
                <div className='absolute left-2 text-gray-700 '>{category}</div>
                <div className='absolute left-1/2 transform -translate-x-1/2 text-lg font-bold'>{name}</div>
                <div className='absolute right-2 text-gray-700 '>{unit}</div>
            </div>
            <div className='flex w-full px-2 pt-4 pb-2 items-center justify-between'>
                <div className='flex flex-col max-w-[70%] '>
                    {/* use 'truncate' to prevent overflowing text -> automatically adding '...'on end of text */}
                    <h4 className='text-sm truncate'>
                        {farmerName}
                    </h4>
                    <p className='text-xs text-gray-700 ' >
                        {farmerLocation}
                    </p>
                </div>
                <button className='px-3 py-1 flex-shrink-0 text-sm border-2 rounded border-black'>
                    + Add
                </button>
            </div>
        </div>  
    )
    // return (
    //     <div key={id} className='flex flex-col my-4 justify-center items-center border-2 border-black rounded-lg sm:w-full sm:max-w-[320px] lg:mx-1'>
    //         <div className='w-full h-[170px] sm:h- bg-cover bg-center'
    //             style={{backgroundImage: `url(${image})`}}>
    //         </div>

    //         {/* put h-5 to make enought space between this div and second   */}
    //         <div className='relative w-full h-7 px-3 mt-2 text-md'>
    //             <div className='absolute left-2 text-gray-700 '>{category}</div>
    //             <div className='absolute left-1/2 transform -translate-x-1/2 text-lg font-bold'>{name}</div>
    //             <div className='absolute right-2 text-gray-700 '>{unit}</div>
    //         </div>
    //         <div className='flex w-full px-2 pt-4 pb-2 items-center justify-between'>
    //             <div className='flex flex-col max-w-[70%] '>
    //                 {/* use 'truncate' to prevent overflowing text -> automatically adding '...'on end of text */}
    //                 <h4 className='text-sm truncate'>
    //                     {farmerName}
    //                 </h4>
    //                 <p className='text-xs text-gray-700 ' >
    //                     {farmerLocation}
    //                 </p>
    //             </div>
    //             <button className='px-3 py-1 flex-shrink-0 text-sm border-2 rounded border-black'>
    //                 + Add
    //             </button>
    //         </div>
    //     </div>  
    // )
}

export default ProductSlide;