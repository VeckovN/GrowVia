import {FC, ReactElement } from 'react';
import { FarmerItemInterface } from '../../shared/interfaces';


const FarmerSlideItem: FC<FarmerItemInterface> = ({
    id,
    name,
    location,
    avatar,
    background
}): ReactElement => {
    return (
        <div key={id} className='
            w-full flex flex-col my-1 border border-greyB rounded-xl bg-white
            md:max-w-[370px] lg:mx-1 cursor-pointer
            hover:opacity-95 hover:shadow-lg transition-shadow duration-100
            '
            onClick={()=>alert(`Farmer: ${name}`)}
        >
            
            <div className='w-full relative bg-red-5003'>
                {/* <div className='w-full h-[100px] bg-cover bg-center relative' */}
                <div className='w-full h-[100px] sm:h-[120px] bg-cover bg-center rounded-tl-xl rounded-tr-xl '
                    style={{backgroundImage: `url(${background.url})`}}>
                </div>

                <div className='relative flex h-[50px]'>
                    <div className='relative'>
                        <img 
                            className='relative w-[110px] h-[60px] bottom-[25px] left-[20px]  object-cover rounded-md '
                            src={avatar.url}
                            alt={name}
                        />
                    </div>
                    <h4 className='font-bold ml-5 py-2 pl-[6%] sm:pr-0 text-sm md:text-base lg:text-base  w-full'>
                        {name} 
                    </h4>
                </div>

            </div>

            <div className='w-full pl-7 pt-0 pb-2'>
                <p className='text-xs md:text-sm text-gray-700' >
                    {location.address}, {location.city}
                </p>
            </div>
        </div>  
    )
}

export default FarmerSlideItem;