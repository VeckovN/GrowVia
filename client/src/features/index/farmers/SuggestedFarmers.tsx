import { FC, ReactElement } from 'react';
import useVisibleCount from '../../hooks/useVisibleCount';
import FarmerSlideItem from './FarmerSlideItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";

import { farmersList, SlideListInterface } from '../../shared/utils/data';


const SuggestedFarmers: FC<SlideListInterface> = ({title}): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:4,
        tablet:6,
        desktop:6
    }) 

    return (
        <section className='container mx-auto px-7 pt-14 max-w-[420px] sm:max-w-[700px] lg:max-w-[1320px] '>

            <div className='flex justify-between px-2 pb-3 items-center '>
                <div>
                    <h2 className='font-bold text-2xl mb-2'> {title} </h2>
                    <div className='hidden sm:flex sm:justify-items-'>
                        <CircleArrowIconButton onClick={()=>alert("Left")}>
                            <GoChevronLeft className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                        <CircleArrowIconButton onClick={()=>alert("Right")}>
                            <GoChevronRight className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                    </div>
                </div>
                <button className=' text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'>All Farmers {'>'}</button>
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={()=>alert("Up")}>
                    <GoChevronUp className='text-3xl'/>
                </CircleArrowIconButton>
            </div>

            {/* 
                on mobile view display 4 items in flex-col, 
                on Table view diplay 6 items -> 3 colums with 2 row's 
                on Larger view display 6 itesm -> 3 colums with 3 row's
            */}
            {/*max-w-[1200px] mx-auto = prevents content from stretching to wide and center it  */}
            <div className='
                grid grid-cols-1 gap-4        
                sm:grid-cols-2 sm:grid-rows-3 sm:gap-2 sm:w-full    
                lg:grid-cols-3 sm:grid-rows-3 lg:gap-2 lg:w-full  
                justify-items-center
                  
            '>
                {/* {productsList.slice(0,4).map((product) => ( */}
                {farmersList.slice(0, visibleCount).map((product) => (
                    <FarmerSlideItem 
                        id={product.id}
                        name={product.name}
                        location={product.location}
                        avatar={product.avatar}
                        background={product.background}
                    />
                ))}
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={()=>alert("Down")}>
                    <GoChevronDown className='text-3xl'/>
                </CircleArrowIconButton>
            </div>
          
        </section>
    )
    
}

export default SuggestedFarmers;
