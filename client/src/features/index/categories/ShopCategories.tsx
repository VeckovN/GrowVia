import {FC, ReactElement, useState } from 'react';
import { productCategories } from '../../shared/utils/data';
import useVisibleCount from '../../hooks/useVisibleCount';
import CategoryItem from './CategoryItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { Swiper, SwiperSlide } from 'swiper/react';

import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

const ShopCategories: FC = (): ReactElement => {
    const navigate = useNavigate();
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    const visibleCount = useVisibleCount({
        mobile:2,
        tablet:4,
        desktop:7
    }) 

    const hanldeCategoryClick = (categoryName: string):void => {
        navigate(`/market?category=${encodeURIComponent(categoryName)}`);
    }

    const handlePrev = () => swiperInstance?.slidePrev();
    const handleNext = () => swiperInstance?.slideNext();

    return (
        <section className='pt-10'>
            <h2 className='pb-5 font-bold text-xl text-center sm:text-2xl'>
                Shop Category
            </h2>

            <div className='py-3 flex items-center mx-auto justify-center max-w-[400px] sm:max-w-[700px] lg:max-w-[1030px] gap-x-autoa'>
                {/* don't display on desktop view */}
                {visibleCount !== 7 && 
                    <div className='mx-2a'> 
                        <CircleArrowIconButton onClick={handlePrev}>
                            <GoChevronLeft className='text-2xl'/>
                        </CircleArrowIconButton>
                    </div>
                }

                <div className='overflow-hidden'>
                    <Swiper
                        slidesPerView={visibleCount}
                        slidesPerGroup={1}
                        onSwiper={setSwiperInstance}
                    >

                    {productCategories.map((category) => (
                        <SwiperSlide key={`category-${category.id}`} >
                            <div className='flex justify-center items-center'>
                                <CategoryItem 
                                    key = {category.id}
                                    id = {category.id}
                                    name = {category.name}
                                    icon = {category.icon}
                                    onCategoryClick = {() => hanldeCategoryClick(category.name)}
                                />
                            </div>
                        </SwiperSlide>
                    ))}

                    </Swiper>
                </div>

                {visibleCount !== 7 && 
                    <div className='mx-2a'> 
                        <CircleArrowIconButton onClick={handleNext}>
                            <GoChevronRight className='text-2xl'/>
                        </CircleArrowIconButton>
                    </div>
                }   
            </div>
        </section>
    )
    
}

export default ShopCategories;
