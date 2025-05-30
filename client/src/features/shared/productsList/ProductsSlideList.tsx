import { FC, ReactElement, useCallback } from 'react';
import useVisibleCount from '../../hooks/useVisibleCount';
import { SlideListInterface, productsList  } from '../utils/data';
import ProductSlideItem from './ProductSlideItem';
import CircleArrowIconButton from '../../shared/CircleArrowIconButton';
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";


const ProductsSlideList: FC<SlideListInterface> = ({title}): ReactElement => {
    const visibleCount = useVisibleCount({
        mobile:3,
        tablet:2,
        desktop:5
    }) 

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

    return (
        <section className='container mx-auto px-7 pt-10 max-w-[400px] sm:max-w-[700px] lg:max-w-[1320px] '>

            <div className='flex justify-between px-2 pb-3 items-center '>
                <div>
                    <h2 className='font-bold text-2xl mb-2 '> {title} </h2>
                     <div className='hidden sm:flex sm:justify-items-start '>
                        <CircleArrowIconButton onClick={()=>alert("Left")}>
                            <GoChevronLeft className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                        <CircleArrowIconButton onClick={()=>alert("Right")}>
                            <GoChevronRight className='text-2xl pl-[-20px]'/>
                        </CircleArrowIconButton>
                    </div>
                </div>
                <button className='font-lato text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'>All Products {'>'}</button>
            </div>

            <div className='flex justify-center mb-2 sm:hidden'> 
                <CircleArrowIconButton onClick={()=>alert("Up")}>
                    <GoChevronUp className='text-3xl'/>
                </CircleArrowIconButton>
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
                    <ProductSlideItem 
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        unit={product.unit}
                        farmerName={product.farmerName}
                        farmerLocation={product.farmerLocation}
                        price={product.price}
                        favorite={product.favorite}
                        image={product.image}
                        // //reference should be passed as () => ,not result of the fucntion
                        addFavorite={() => addFavoriteHandler(product.id)} 
                        
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

export default ProductsSlideList;