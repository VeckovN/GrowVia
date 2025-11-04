import {FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductDocumentInterface, ProductMarketCardPropsInterface } from '../product.interface';
import { CartProductInterface } from '../../cart/cart.interface';
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

const ProductMarketCard:FC<ProductMarketCardPropsInterface> = ({product, isFavorite, addToCart, addToFavorite}):ReactElement =>{
    const navigate = useNavigate();

    const handleAddToCart = (product:ProductDocumentInterface):void =>{
        const productData:CartProductInterface = {
            productID: product.id!,
            name: product.name,
            imageUrl: product.images?.[0]?.url ?? '',
            price: product.price,
            unit: product.unit,
            quantity: 1,
            totalPrice: product.price.toFixed(2),
            //if authUser.wishlist.contains(product.id) ? true : false
            favorite:isFavorite
        }

        addToCart(product.farmerID!, product.farmName! ,productData);
    }

    return (
        <div 
            className='
                w-[200px] w-fulla h-full border border-greyB p-2 rounded-md cursor-pointer
                hover:opacity-95 hover:shadow-lg transition-shadow duration-100
                z-10
            '
            onClick={() => navigate(`/product/overview/${product.id}`)}
        >
            <div className='relative w-[90%]a mx-auto' onClick={() => navigate(`/product/overview/${product.id}`)}>
                <img
                    className=' w-full h-[110px] object-cover rounded-md'
                    src={product?.images[0].url }
                />
                <div className='absolute top-1 left-1 py-1 px-2 bg-gray-300 text-[10px] font-medium font-poppins rounded'>
                    {product.category}
                </div>
            </div>
            
            <div className='mt-2 relative flex justify-center items-center text-sm mb-2 min-h-[40px]a'>
                {/* Product Name - Absolutely centered */}
                <div className='absolute left-1/2 transform -translate-x-1/2 text-center px-2 truncate max-w-[70%]'>
                    {product.name}
                </div>
                
                {/* Unit - Pushed to far right */}
                <div className='ml-auto text-gray-500 whitespace-nowrap'>
                    {product.unit}
                </div>
            </div>

            <div className='flex justify-evenly items-center text-xs '>
                <p className='font-medium'>${product.price}</p>
                <button 
                    className='font-medium border border-greyB h-6 px-3 rounded hover:bg-gray-100 z-20'
                    onClick={(e) => {
                        e.stopPropagation(); //prevent outer onClick ->navigation to product
                        handleAddToCart(product)
                    }}
                >
                    Add to Cart
                </button>
                <button 
                    className='w-6 h- bg-white text-lg font-semibold font-lato rounded flex justify-center items-center cursor-pointer hover:bg-gray-300 z-20'
                    onClick={(e) => {
                        e.stopPropagation(); //prevent outer onClick ->navigation to product
                        addToFavorite()
                    }}
                >
                    {/* <VscHeart className='text-xl text-red-500'/> */}
                    {/* for logged user */}
                    {isFavorite 
                    ? <VscHeartFilled className='text-3xl text-red-500'/>
                    : <VscHeart className='text-3xl text-red-500'/>
                    }
                </button>
            </div>

            <div className='mt-2 text-xs '>
                <p className='font-semibold'>Farmer: <span className='font-normal'> {product.farmName} </span></p>
                <div className='text-gray-500 font-medium'>Location: <span className='font-normal'>{`${product.farmerLocation?.address}, ${product.farmerLocation?.city}`}</span></div>
            </div>
        </div>
    )
}
export default ProductMarketCard