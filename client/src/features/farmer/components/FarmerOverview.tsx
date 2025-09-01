import { FC, ReactElement, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFarmerByIDQuery } from '../farmer.service';
import { useGetProductByFarmerIDQuery } from '../../product/product.service';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import ProductsSlideList from '../../shared/productsList/ProductsSlideList';
import SocialLinks from '../../shared/user/SocialLinks';
import FarmerGalleryGrid from './FarmerGalleryGrid';
import { SOCIAL } from '../../shared/utils/data';

const FarmerOverview: FC = (): ReactElement => {
    const { id } = useParams()

    const {data:farmerData, isLoading:isFarmerLoaded} = useGetFarmerByIDQuery(id as string);
    const {data:productsData, isLoading:isProductLoading} = useGetProductByFarmerIDQuery({farmerID:id as string, from:0, size:8});
    const farmer = farmerData?.farmer;
    const [socialLinks, setSocialLinks] = useState<Array<{name:string, url:string}>>([]);

    useEffect(() =>{
        if(farmerData?.farmer){
            const links = SOCIAL.map((el) => {
                const existingUrl = farmer?.socialLinks!.find((url: string) =>
                    url.toLowerCase().includes(el.name.toLowerCase())
                );
                return {
                    name: el.name,
                    url: existingUrl || '',
                };
            })
            setSocialLinks(links);
        }
    },[farmerData])

    if (isFarmerLoaded) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
            <div className="text-xl font-semibold">
                <LoadingSpinner spinnerClassName='text-gray-800' />
            </div>
        </div>
    );
    }

    return (
        <div className='w-full px-4a sm:px-10a'>
            <div 
                className='w-full h-64 bg-cover bg-center background with avatar'
                style={{ backgroundImage: `url(${farmer?.backgroundImage?.url})`}}
            >        
            </div>

            <div className='relative flexa flex-cola gap-y-10a w-max-sma w-fulla w-[95%] sm:w-[95%]a md:w-[90%] mx-auto py-10 bg-red-300a'>
            {/* <div className='flexa flex-cola mx-auto mb-8 w-[95%] max-w-sm md:max-w-md lg:max-w-4xl bg-red-200'> */}
                <div className='absolute top-1 right-0 xs:right-3 flex justify-end gap-x-3 '>
                    <SocialLinks links={socialLinks}/>
                </div>

                <div className='relativea absolute top-[-5rem] h-60a max-w-md'>
                    <img
                        className='relative top-[-7rem]a sm:left-0 left-4a w-44 h-36 object-cover rounded-xl'
                        src={farmer?.profileAvatar?.url}
                    />

                    <div className='pt-3'>
                        <div className='flex flex-col'>
                            <h2 className='font-poppins text-2xl font-semibold'> {farmer?.farmName} </h2>
                            <p className='text-sm font-lato'>{`${farmer?.location?.address}, ${farmer?.location?.city}`}</p>
                        </div>

                    </div>
                </div>
                

                <div className='mt-36 flex flex-col gap-y-16 '>
                
                    <div className='w-full'>
                        <nav className='flex flex-col border-b border-gray-300 overflow-x-auto lg:max-w-4xla'>
                            <ul className='flex text-md font-poppins whitespace-nowrap cursor-pointer'>
                                <li className='border-b-2 border-transparent px-5 py-2 sm:px-7 hover:border-green-600 hover:text-green-600'>
                                    About
                                </li>
                                <li className='border-b-2 border-transparent px-5 py-2 sm:px-7 hover:border-green-600 hover:text-green-600'>
                                    Products
                                </li>
                                <li className='border-b-2 border-transparent px-5 py-2 sm:px-7 hover:border-green-600 hover:text-green-600'>
                                    Gallery
                                </li>
                                <li className='border-b-2 border-transparent px-5 py-2 sm:px-7 hover:border-green-600 hover:text-green-600'>
                                    Location
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className='w-full'>
                        <h2 className='font-semibold text-2xl'> About</h2>
                        <p className='pt-4 text-md text-gray-700 leading-normal'>
                            {farmer?.description}
                        </p>
                    </div>

                    <div className='w-full'>
                        <ProductsSlideList
                            title="Products"
                            data={productsData?.products ?? []}
                            isLoading={isProductLoading}
                        />
                    </div>

                    <div className='w-full'>
                        <h2 className='font-semibold text-2xl'> Gallery</h2>
                        <FarmerGalleryGrid images={farmer?.profileImages ?? [] }/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FarmerOverview