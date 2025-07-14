import { FC, ReactElement, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useGetProductByIDQuery, useGetSimilarProductsQuery } from '../product.service';
import { useGetProductByIDQuery, useGetNewestProductsQuery } from '../product.service';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import ProductsSlideList from '../../shared/productsList/ProductsSlideList';

import { VscHeart } from "react-icons/vsc";
import { VscHeartFilled } from "react-icons/vsc";

import Breadcrumbs from '../../shared/page/Breadcrumbs';
import TestImg from '../../../assets/farmers/avatar1.jpg';
import { BreadcrumbsPropsInterface } from '../../shared/interfaces';

const ProductOverview: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams(); //get id from 'page url'
  const [amount, setAmount] = useState(1);

  // If `id` might be undefined, pass it only when it's available
  const { data, isLoading } = useGetProductByIDQuery(id!, {
    skip: !id // skip the query if ID is not present
  });

  const {data:productsData, isLoading: isProductLoading, refetch} = useGetNewestProductsQuery('8');
  //IMPLEMNT THIS ("getSimilarProducts") -> parameters('similarProductID', 'limit')
  // const {data:productsData, isLoading: isProductLoading, refetch} = useGetSimilarProductsQuery(data?.product?._id, '10'); 

  console.log("Product: ", data);

  const product = data?.product;
  console.log("get product: ", product);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
        <div className="text-xl font-semibold">
          <LoadingSpinner spinnerClassName='text-gray-800 ' />
        </div>
      </div>
    );
  }

  const breadItems = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Market',
      href: '/market',
    },
    {
      label: `${data?.product?.category}`,
      href: `/market/${data?.product?.category}`, //is going to be added
    },
    {
      label: `${data?.product?.name}`,
      href: ''
    }
  ]

  const onAddToCartHandler = ():void => {
  // const onAddToCartHandler = ():Promise<void> => {

  }

  return (
    <div className='w-full px-4 sm:px-10'>

      <div className='pt-4 pb-6'>
        <Breadcrumbs items={breadItems} />
      </div>

      <div className='w-full'>

        <div className='mb-8 w-[95%] max-w-sm md:max-w-md lg:max-w-4xl mx-auto flex flex-col lg:flex-row '>

          <div className='w-full mx-auto'>
            <div className='w-full'>
              <img
                className="w-full object-cover rounded border border-gray-300 p-3"
                src={product?.images ? product?.images[0].url : TestImg}
              />
            </div>

            {/* smallImages -> Swipper with sliders ->displat 3 initialy*/}
            <div className='grid grid-rows-1 grid-cols-3 justify-items-center pt-8'>
              {Array.isArray(product?.images) && product.images.length > 1 &&
                product.images.slice(1).map((el, index) => (
                  <img
                    key={el.publicID}
                    className="w-fulla w-[85%] aspect-squarea object-cover border border-gray-300 rounded p-1"
                    // className="p-1 w-16 h-16 object-cover border border-gray-300 rounded"
                    src={el.url}
                    alt={`Product image ${index}`}
                  />
                ))
              }
            </div>
          </div>

          <div className='hidden lg:block w-1 mx-3 bg-greyB '>
          </div>

          <div className='w-full max-w-sm md:max-w-md'>
            <div className='flex flex-col'>

              <div className='w-full py-3 flex justify-between border-b-2 border-greyB'>
                <div className=''>
                  <h2 className='text-xl'>{product?.name}</h2>
                  <p className='text-md'>{`$${product?.price}/${product?.unit}`}</p>
                </div>

                <div className='
                  w-16 h-10 bg-white opacity-80 text-lg font-semibold font-lato
                  rounded flex justify-center items-center 
                  group-hover:flex cursor-pointer hover:bg-grey hover:border-r-2 hover:border-b-2 hover:border-greyB 
                  '
                  onClick={() => alert(`add to Favorite ${product?.id}`)}
                >
                  {product?.favorite
                    ? <VscHeartFilled className='text-2xl text-red-500' />
                    : <VscHeart className='text-2xl text-red-500' />
                  }
                </div>
              </div>

              <p className='text-sm text-gray-600 py-2'>
                {product?.shortDescription}
              </p>

              <div className='py-2 flex'>
                <div className='flex'>
                  <button
                    className='w-8 h-8 rounded-md text-center border-2 bg-white'
                    onClick={() => amount > 1 && setAmount(prev => prev - 1)}
                  >
                    -
                  </button>

                  <div className='w-8 h-8 rounded-md flex justify-center items-center border bg-white text-sm'>
                    {amount}
                  </div>

                  <button
                    className='w-8 h-8 rounded-md text-center border-2 bg-white'
                    onClick={() => setAmount(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>

                <button 
                  className='bg-green6 text-white text-sm py-1 px-6 rounded ml-5 hover:bg-green7' 
                  onClick={onAddToCartHandler}
                >
                  Add to Cart
                </button>
              </div>

              <div 
                className='flex justify-between my-6 p-1 border border-greyB rounded-sm hover:bg-gray-200 cursor-pointer'
                onClick={() => navigate(`/farmer/overview/${product?.farmerID}`)}
              >
                <div className='pl-6 flex flex-col justify-evenly'>
                  <div> Farmer: </div>
                  
                  <div className="">
                    <h3 className='font-semibold'>{product?.farmName}</h3>
                    <p className='text-xs'>{`${product?.farmerLocation?.address}, ${product?.farmerLocation?.city}`} </p>
                  </div>
                </div>

                <div className=''>
                  <img 
                    className='w-28 h-20 rounded-md object-cover'
                    //for test (the farmerAvatar missing for now)
                    // src={TestImg}
                    src={product?.farmerAvatar?.url ?? TestImg}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className='w-full'>
          {/* Swiper with additional  */}
          <nav className='
            flex flex-col w-[95vw] relative left-1/2 -translate-x-1/2 list-none border-b-2 border-greyB overflow-x-auto
            lg:left-autoa lg:translate-x-auto lg:max-w-4xl
          '>
            <ul className='flex justify-between items-center text-md font-poppins whitespace-nowrap cursor-pointer'>
              <li className='border-b-2 px-3 py-2 hover:border-green6 hover:text-green6'>
                Atributes
              </li>
              <li className='border-b-2 px-2 py-2 lg:px-3 hover:border-green6 hover:text-green6'>
                Description
              </li>
              <li className='border-b-2 px-2 py-2 lg:px-3 hover:border-green6 hover:text-green6'>
                Details
              </li>
              <li className='border-b-2 px-2 py-2 lg:px-3 hover:border-green6 hover:text-green6'>
                Location
              </li>
              <li className='border-b-2 px-2 py-2 lg:px-3 hover:border-green6 hover:text-green6'>
                Review(Coming Soon)
              </li>
              <li className='border-b-2 px-2 py-2 lg:px-3 hover:border-green6 hover:text-green6'>
                Similar Products
              </li>
            </ul>
          </nav>

          <div className='flex flex-col gap-y-10 w-max-sma w-full sm:w-[95%] lg:w-full mx-auto py-10'>

            <div className='w-full'>
              <h2 className='font-semibold text-2xl'> Product Atributes</h2>
              <ul className='pl-4 pt-2 text-gray-700'>
                  {product?.subCategories?.map(el => (
                    <li key={el} className=''>
                       {el}
                    </li>
                  ))}
              </ul>                
            </div>

            <div className='py-10a'>
              <h2 className='font-semibold text-2xl'> Product Description</h2>
              <p className='pt-4 text-md text-gray-700 leading-normal'>
                {product?.description}
              </p>
            </div>

            <div className='py-10a w-[70%]'>
              <h2 className='font-semibold text-2xl pb-4'> Details</h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 text-md'>
                <div className='space-y-1'>
                  <p className='font-medium'>Title: <span className='font-light'>{product?.name}</span></p>
                  <p className='font-medium'>Category: <span className='font-light'>{product?.category} </span></p>
                  <p className='font-medium'>Unit: <span className='font-light'>{product?.unit} </span></p>
                  <p className='font-medium'>Organic: <span className='font-light'>{product?.subCategories?.includes('Organic') ? 'Yes' : 'No'} </span></p>
                  <p className='font-medium'>Fresh: <span className='font-light'>{product?.subCategories?.includes('Fresh') ? 'Yes' : 'No'} </span></p>
                </div>

                <div className='space-y-1 py-1 sm:py-0'>
                  <p className='font-medium'>Farmer's Name: <span className='font-light'>{product?.farmName}</span></p>
                  <p className='font-medium'>Location: <span className='font-light'>{`${product?.farmerLocation?.address}, ${product?.farmerLocation?.city}`}</span></p>
                </div>
              </div>
            </div>

            <div className='py-10a'>
              <h2 className='font-semibold text-2xl text-2xl'> Rewview<span className='font-light'> (Comming Soon)</span></h2> 
            </div>

            <div className=''>
              <ProductsSlideList
                title="Similar Products"
                data={productsData?.products ?? []}
                isLoading={isProductLoading}
              />
            </div>
          
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductOverview;