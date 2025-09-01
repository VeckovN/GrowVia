import { FC, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVisibleCount from '../../hooks/useVisibleCount';
import FarmerSlideItem from './FarmerSlideItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { useGetNewestFarmersQuery } from '../../farmer/farmer.service';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import { DEFAULT_IMAGE } from '../../shared/utils/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const SuggestedFarmers: FC = (): ReactElement => {
    const navigate = useNavigate();
    const visibleCount = useVisibleCount({
        mobile:4,
        tablet:6,
        desktop:6
    }) 

    const { data, isLoading } = useGetNewestFarmersQuery(12);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    const handlePrev = () => swiperInstance?.slidePrev();
    const handleNext = () => swiperInstance?.slideNext();

    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    return (
        <section className='container mx-auto pt-14 max-w-[420px] sm:max-w-[700px] lg:max-w-[1320px]'>

            <div className='flex justify-between px-2 pb-3 items-center '>
                <div>
                    <h2 className='font-bold text-2xl mb-2'> Farmers </h2>
                    <div className='hidden sm:flex sm:justify-items-'>
                        <CircleArrowIconButton onClick={handlePrev}>
                            <GoChevronLeft className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                        <CircleArrowIconButton onClick={handleNext}>
                            <GoChevronRight className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                    </div>
                </div>
                <button 
                    className='text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'
                    onClick={() => navigate('/farmers')}
                >
                    All Farmers {'>'}
                </button>
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={handlePrev}>
                    <GoChevronUp className='text-3xl'/>
                </CircleArrowIconButton>
            </div>

            {/* 
                on mobile view display 4 items in flex-col, 
                on Table view diplay 6 items -> 3 colums with 2 row's 
                on Larger view display 6 itesm -> 3 colums with 3 row's
            */}
            {isLoading ? (
                <div className="mx-auto">
                    <LoadingSpinner />
                </div>
            ) : (
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                >
                {chunkArray(data?.farmers || [], visibleCount).map((chunk, i) => (
                    <SwiperSlide key={`farmer-chunk-${i}`}>
                        <div
                            className="
                                grid grid-cols-1 gap-4        
                                sm:grid-cols-2 sm:grid-rows-3 sm:gap-2 sm:w-full    
                                lg:grid-cols-3 lg:grid-rows-2 lg:gap-2 lg:w-full  
                                justify-items-center
                            "
                        >
                            {chunk.map((farmer) => (
                            <FarmerSlideItem
                                key={farmer.userID}
                                id={farmer.userID ?? ''}
                                name={farmer.farmName ?? ''}
                                location={{
                                    city: farmer.location?.city ?? 'Unknown city',
                                    address: farmer.location?.address ?? 'Unknown address',
                                }}
                                avatar={farmer.profileAvatar ?? DEFAULT_IMAGE}
                                background={farmer.backgroundImage ?? DEFAULT_IMAGE}
                            />
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
            )}

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={handleNext}>
                    <GoChevronDown className='text-3xl'/>
                </CircleArrowIconButton>
            </div>
          
        </section>
    )
    
}

export default SuggestedFarmers;
