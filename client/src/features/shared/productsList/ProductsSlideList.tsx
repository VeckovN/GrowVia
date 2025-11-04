import { FC, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';
import useVisibleCount from '../../hooks/useVisibleCount';
import { SlideListInterface } from '../interfaces';
import ProductSlideItem from './ProductSlideItem';
import { GoChevronLeft, GoChevronRight,  GoChevronUp, GoChevronDown } from "react-icons/go";
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { DEFAULT_IMAGE } from '../utils/data';
import LoadingSpinner from '../page/LoadingSpinner';
import { ReduxStateInterface } from '../../../store/store.interface';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductsSlideList: FC<SlideListInterface> = ({title, data:productsData, isLoading:isProductLoading}): ReactElement => {
    const navigate = useNavigate();
    const wishlist = useAppSelector((state: ReduxStateInterface) => state.authUser.wishlist)
    
    const visibleCount = useVisibleCount({
        mobile:2,
        tablet:4,
        desktop:4
    }) 

    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    const handlePrev = () => swiperInstance?.slidePrev();
    const handleNext = () => swiperInstance?.slideNext();

    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = []; 
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }

    //out put result
    //const result = chunkArray([1, 2, 3, 4, 5], 2);
    // result = [[1, 2], [3, 4], [5]]

    return (
        <section className='container mx-auto pt-10 max-w-[400px] sm:max-w-[700px] lg:max-w-[1320px] '>

            <div className='flex justify-between px-2 items-center '>
                <div>
                    <h2 className='font-bold text-2xl mb-2 '> {title} </h2>
                     <div className='hidden sm:flex sm:justify-items-start '>
                        <CircleArrowIconButton onClick={handlePrev}>
                            <GoChevronLeft className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                        <CircleArrowIconButton onClick={handleNext}>
                            <GoChevronRight className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                    </div>
                </div>
                <button 
                    className='font-lato text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'
                    onClick={() => navigate('/market')}
                >
                    All Products {'>'}
                </button>
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                {/* <CircleArrowIconButton onClick={()=>alert("Up")}> */}
                <CircleArrowIconButton onClick={handlePrev}>
                    <GoChevronUp className='text-3xl'/>
                </CircleArrowIconButton>
            </div>

            {/* 
                on mobile view display 3 items in flex-col, 
                on Table view diplay 2 items  in flex-row
                on Larger view display 4 items in flex-row as well
            */}
                {isProductLoading ? 
                    (
                        <div className='mx-auto'>
                            <LoadingSpinner/>
                        </div>
                    )
                    :
                    (
                        <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            onSwiper={setSwiperInstance}
                        >
                            {chunkArray(productsData || [], visibleCount).map((chunk, i) => (
                                <SwiperSlide key={`chunk-${i}`}>
                                    <div className={`
                                        grid gap-4
                                        grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:justify-items-center
                                    `}>
                                        {chunk.map(product => (
                                            <ProductSlideItem
                                                key={product.id}
                                                id={product.id!}
                                                name={product.name}
                                                category={product.category}
                                                unit={product.unit}
                                                description={product.shortDescription!}
                                                farmerID={product.farmerID ?? '0'}
                                                farmName={product.farmName ?? 'Unknown Farm'}
                                                farmerLocation={product.farmerLocation ?? {}}
                                                price={product.price}
                                                // favorite={wishlist?.includes(product.id!) ?? false}
                                                image={product.images?.[0] ?? DEFAULT_IMAGE}
                                            />
                                        ))}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )
                }

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={handleNext}>
                    <GoChevronDown className='text-3xl'/>
                </CircleArrowIconButton>
            </div>
          
        </section>
    )
}

export default ProductsSlideList;