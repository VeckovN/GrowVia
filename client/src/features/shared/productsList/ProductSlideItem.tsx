import {FC, ReactElement } from 'react';
import { ProductItemInterface } from '../utils/data';

import { VscHeart } from "react-icons/vsc";
import { VscHeartFilled } from "react-icons/vsc";

const ProductSlideItem: FC<ProductItemInterface> = ({
    id, 
    name, 
    category,
    unit,
    farmerName,
    farmerLocation,
    price,
    favorite,
    image,
    addFavorite
}): ReactElement => {
    console.log("ProdcutSlideItem: " + id);
    return (
        // This component will be reused in other components so the hardcoded width/height aren't good options -> 
        //i'ts better to leaft to the parrents (to controll widht/height)
        <div key={id} className='
            group flex flex-col my-4 justify-centers items-center
            border-2 border-greyB rounded-lg sm:w-full sm:max-w-[320px] lg:mx-1 bg-white 
            hover:opacity-90 hover:shadow-lg transition-shadow duration-100'
        >
            <div className='relative w-full h-[170px]  sm:h- bg-cover bg-center'
                style={{backgroundImage: `url(${image})`}}>
                
                {/* use relative instead of abosulte to be able to achive hover effect */}
                <div className='
                    hidden w-24 h-14 relative top-[-2px] left-[-2px] bg-white opacity-80
                    text-lg font-semibold font-lato rounded flex justify-center items-center 
                    group-hover:flex cursor-pointer hover:bg-grey hover:border-r-2 hover:border-b-2 hover:border-greyB 
                '
                    onClick={() => addFavorite(id)}
                >
                    {favorite 
                    ? <VscHeartFilled className='text-3xl text-red-500'/>
                    : <VscHeart className='text-3xl text-red-500'/>
                    }
                </div>

                <div className='
                    hidden w-24 h-14 absolute top-[-2px] right-[-2px] bg-white opacity-80
                    text-lg font-semibold font-lato rounded flex justify-center items-center
                    group-hover:flex
                '
                >
                    ${price}
                </div>
            </div>

            <div className='w-full px-3 py-2 grid grid-cols-3 items-center'>
                <div className='text-greyC text-sm truncate text-left pr-2'>
                    {category}
                </div>
                
                <div className='text-center mx-auto'>
                    <h3 className='text-lg font-medium truncate max-w-[200px] px-1'>
                        {name}
                    </h3>
                </div>
                
                <div className='text-greyC text-sm truncate text-right pl-2'>
                    {unit}
                </div>
            </div>


            <div className='flex w-full px-2 pt-2 pb-2 items-center justify-between'>
                <div className='flex flex-col max-w-[70%] '>
                    {/* use 'truncate' to prevent overflowing text -> automatically adding '...'on end of text */}
                    <h4 className='text-sm truncate'>
                        {farmerName}
                    </h4>
                    <p className='font-lato text-xs text-greyC' >
                        {farmerLocation}
                    </p>
                </div>
                <button className='px-3 py-1 flex-shrink-0 text-sm border-2 rounded border-greyB hover:bg-grey'>
                    + Add
                </button>
            </div>
        </div>  
    )
}

export default ProductSlideItem;