import { FC, ReactElement } from 'react';
import useVisibleCount from '../../hooks/useVisibleCount';
import FarmerSlideItem from './FarmerSlideItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { useGetNewestFarmersQuery } from '../../farmer/farmer.service';
import { SlideListInterface } from '../../shared/interfaces';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import { DEFAULT_IMAGE } from '../../shared/utils/data';

const SuggestedFarmers: FC<SlideListInterface> = ({title}): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:4,
        tablet:6,
        desktop:6
    }) 

    const { data, isLoading } = useGetNewestFarmersQuery(10);
    console.log("FarmersData: ", data);

    return (
        <section className='container mx-auto pt-14 max-w-[420px] sm:max-w-[700px] lg:max-w-[1320px]'>

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
                lg:grid-cols-3 lg:grid-rows-2 lg:gap-2 lg:w-full  
                justify-items-center
            '>
                {isLoading
                ?
                    <div className='mx-auto'>
                        <LoadingSpinner/>
                    </div>
                :
                
                    data?.farmers?.slice(0, visibleCount).map((farmer) => (
                        <FarmerSlideItem 
                            id={farmer.userID ?? ''}
                            name={farmer.farmName ?? ''}
                            location={{
                                city:farmer.location?.city ?? "Unknown city", 
                                address:farmer.location?.address ?? 'Unknown address'
                            }}
                            // avatar={farmer.profileAvatar ?? {url:'', publicID:''}}
                            avatar={farmer.profileAvatar ?? DEFAULT_IMAGE}
                            background={farmer.backgroundImage ?? DEFAULT_IMAGE}
                        />
                    ))
                }
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
