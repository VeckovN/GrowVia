import { FC } from 'react';
import { CartDropdownProductInterface } from '../cart.interface';

import { VscHeart } from "react-icons/vsc";
import { VscHeartFilled } from "react-icons/vsc";


const CartDropdownProduct:FC<CartDropdownProductInterface> = ({product, farmerID, onIncreaseProduct, onDecreseProduct, onRemoveProduct}) => {

    return (
        <div className='px-2 py-2 flex justify-between items-center  border-b border-greyB/50'>
            <div className='w-1/3'>
                <img 
                    // className='w-full max-w-[100px]a sm:max-w-[150px] max-h-[100px] w-[140px]a rounded-md object-cover'
                    className='w-full max-w-[160px] h-[90px] max-h-[100px] rounded-md object-cover'
                    src={product.imageUrl}
                />
            </div>

            <div className='flex flex-col sm:flex-1 xs:gap-y-1 justify-evenly'>
                <h4 className='text-[18px]'>{product.name}</h4>
                <div className='
                    flex flex-col text-gray-500 text-sm 
                    xs:flex-row xs:gap-x-1 
                '>
                    <p>Unit: <span className='text-black font-semibold'>{product.unit}</span></p>
                    <p>Per unit: <span className='text-black font-semibold'>{product.price}</span></p>
                </div>
                <div className='w-full flex xs:gap-x-3'>
                    <button 
                        className='
                            font-lato border border-greyB px-3 text-sm text-red-600 rounded 
                            xs:px-3 xs:text-md  hover:bg-red-400 hover:text-white hover:border-red-400
                        '
                        onClick={(e) => {
                            e.stopPropagation();
                            // onRemoveProduct(data.farmerID!, product.productID)
                            onRemoveProduct(farmerID, product.productID)
                        }}

                    >
                        Remove
                    </button>
                    <button 
                        className='
                            w-6 ml-1  flex justify-center items-center text-md font-semibold font-lato rounded 
                            sm:text-lg rounded cursor-pointer z-20 group
                        '
                        onClick={(e) => {
                            e.stopPropagation(); //prevent outer onClick ->navigation to product
                            // addToFavorite()
                        }}
                    >
                        {product.favorite 
                        ? <VscHeartFilled className=' text-3xl text-red-500'/>
                        : <VscHeart className='group-hover:text-red-300 text-3xl text-red-500'/>
                        }
                    </button>

                </div>
            </div>

            <div className='flex flex-col items-center sm:flex-row xs:gap-x-4'>
                <div className='flex gap-x-1 rounded-xl'>
                        <button
                        className='border border-greyB w-8 h-8 rounded-md'
                        // onClick={() => setAmount(prev => (prev > 1 ? prev-1 : prev))}
                        // onClick={() => onDecreseProduct(data.farmerID!, product.productID)}
                        onClick={() => onDecreseProduct(farmerID, product.productID)}
                    >
                        -
                    </button>
                    <div className='flex justify-center items-center border border-greyB w-8 md:w-10 h-8 rounded-md'>
                        {product.quantity}
                    </div>
                    <button 
                        className='border border-greyB w-8 h-8 rounded-md'
                        // onClick={() => setAmount(prev => prev +1)}
                        // onClick={() => onIncreaseProduct(data.farmerID!, product.productID)}
                        onClick={() => onIncreaseProduct(farmerID, product.productID)}
                    > 
                        +
                    </button>
                </div>

                <h4 className='text-center  font-semibold mr-1'>
                    ${product.price}
                </h4>
            </div>
        </div>
    )
}

export default CartDropdownProduct;