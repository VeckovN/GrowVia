import { FC, ReactElement, useState, useCallback } from 'react';
import { useGetNewestProductsQuery } from '../../product/product.service';
import useVisibleCount from '../../hooks/useVisibleCount';
import { SlideListInterface } from '../interfaces';
import ProductSlideItem from './ProductSlideItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { DEFAULT_IMAGE } from '../utils/data';
import LoadingSpinner from '../page/LoadingSpinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductsSlideList: FC<SlideListInterface> = ({title, data:productsData, isLoading:isProductLoading}): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:3,
        tablet:2,
        // desktop:5
        desktop:4
    }) 

    // const {data:productsData, isLoading: isProductLoading, refetch} = useGetNewestProductsQuery('8');
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    console.log("data: ", productsData);

    const handlePrev = () => swiperInstance?.slidePrev();
    const handleNext = () => swiperInstance?.slideNext();

    //Prevent func recreating on every render 
    const addFavoriteHandler = useCallback((productID: string): void =>{
        // if(!isCustomer){
        //     toast.error("Please log in to add favorites");
        //     return;
        // }

        //add to the list with redux tollkit
        //dispatch(AddProductToFavorites(productID)); //This will change favorite state as favorite/unfavorite - true/false

        alert(`Add Favorite Product: ${productID}`);

    }, []);
    // }, [isCustomer]); //on auth implementation -> re-create function on user auth action

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
                <button className='font-lato text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'>All Products {'>'}</button>
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
                                    grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                                `}>
                                    {chunk.map(product => (
                                        <ProductSlideItem
                                            key={product.id}
                                            id={product.id!}
                                            name={product.name}
                                            category={product.category}
                                            unit={product.unit}
                                            farmerID={product.farmerID ?? '0'}
                                            farmName={product.farmName ?? 'Unknown Farm'}
                                            farmerLocation={product.farmerLocation ?? {}}
                                            price={product.price}
                                            favorite={product.favorite ?? false}
                                            image={product.images?.[0] ?? DEFAULT_IMAGE}
                                            addFavorite={() => product.id && addFavoriteHandler(product.id)}
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