import { Suspense, lazy, FC, useState, useEffect, ChangeEvent } from 'react';
import { useAppSelector } from '../../../store/store';
import { useModal } from '../../shared/context/ModalContext';
import { FarmerProductPaginationInterface } from '../farmer.interface';
import { ReduxStateInterface } from '../../../store/store.interface';
import FarmerProductsTable from './ProductsTable/FarmerProductsTable';
import ViewProductModal from '../../product/components/ViewProductModal';
import { useGetProductByFarmerIDQuery } from '../../product/product.service';

import Modal from '../../shared/Modal';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import SelectField from '../../shared/inputs/SelectField';
import { CreateProductInterface, ProductDocumentInterface } from '../../product/product.interface';
import DeleteProductModal from '../../product/components/DeleteProductModal';

const ProductForm = lazy(() => import('../../product/components/ProductForm'));

const FarmerProducts:FC = () => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const { activeModal, modalData, openModal, closeModal } = useModal();
    //use refetch after creating product (to dispay the new created in the list)
    const [pagination, setPagination] = useState<FarmerProductPaginationInterface>({
        sort: 'newest',
        from:0,
        size: 10,
        currentPage: 1,
        totalPages: 1, 
    })
    
    const {data, isLoading, refetch} = useGetProductByFarmerIDQuery({
        farmerID:authUser.id!,
        from: pagination.from,
        size: pagination.size,
        sort: pagination.sort
    });

    const selectOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'available', label: 'Available' },
    ]

    useEffect(() =>{
        if(data?.total){
            const calcucatedTotalPages = Math.ceil(data?.total / pagination.size!);
            setPagination(prev => ({
                ...prev,
                totalPages: calcucatedTotalPages
            }))
        }
    },[data?.total, pagination.sort, pagination.size])

    const {id:farmerID, farmName, profileAvatar:farmerAvatar ,location } = authUser;
    const farmerLocation = {
        country: location.country,
        city: location.city,
        address: location.address
    }

    const transformEditData = (productData: ProductDocumentInterface):Partial<CreateProductInterface> =>{
        const transformedData = {
            name: productData.name,
            description: productData.description,
            shortDescription: productData.shortDescription,
            category: productData.category,
            subCategories: productData.subCategories,
            price: productData.price,
            stock: productData.stock,
            unit: productData.unit,
            tags: productData.tags,
        }
        return transformedData;
    }

    const onSelectChange = (e:ChangeEvent<HTMLSelectElement>):void =>{
        setPagination(prev => ({
            ...prev,
            sort: e.target.value as "newest" | "oldest" | "available"
        }))
    }
    
    return (     
        <div className='w-full'>
            <h3 className='hidden sm:block text-xl font-medium ml-3 '>
                Products
            </h3>

            <div className='mt-5'>
                <button
                    className='
                        py-2 px-4 border border-greyB rounded-md font-medium bg-gray-200
                        hover:bg-gray-300'
                    onClick={() => openModal('add')}
                >
                    Add Product
                </button>
            </div>

            <div className='mb-3 flex justify-end '>
                <div>
                    <SelectField 
                        className={`p-[11px] pl-4 bg-white text-gray-500`}
                        id='sort'
                        name='sort'
                        value={pagination.sort!}
                        options={selectOptions}
                        onChange={onSelectChange}
                    />
                </div>

            </div>

            <div className='w-full bg-red-4001'>
                {isLoading ? (
                    <div>Loading...</div>
                )
                : data?.products && data.products.length > 0
                    ? (
                        <div className='overflow-x-auto'>
                            <FarmerProductsTable
                                products={ data.products }
                                totalProducts={ data.total ?? 0}
                                pagination={pagination}
                                //This funtion will be passed to the child compoennet (FarmerProductTable) which will the pass it to the Pagination component
                                //it will re-trigger pagination state(defined here) and intiate a new request with updated pagination state
                                onPaginationChange={(updates) => {
                                    setPagination(prev => ({...prev, ...updates}))
                                }}
                            />
                        </div>
                    ) : (
                        <div className=''>
                            You don't have any products
                        </div>
                    )}

                {activeModal === 'add' &&
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <ProductForm 
                                mode='create' 
                                farmerID={farmerID!} 
                                farmName={farmName!}
                                farmerLocation={farmerLocation!}
                                farmerAvatar={farmerAvatar!}
                                onCloseModal={closeModal} 
                                refetchProducts={refetch}
                            / >
                        </Suspense>
                    </Modal>
                }

                {activeModal === 'edit' &&
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <ProductForm 
                                mode='edit' 
                                initialData={transformEditData(modalData.product!)} 
                                // farmerID={authUser.id!} 
                                farmerID={farmerID!} 
                                onCloseModal={closeModal} 
                                refetchProducts={refetch}
                            / >
                        </Suspense>
                    </Modal>
                }
                
                {activeModal == 'view' &&
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            {modalData.product &&
                                <ViewProductModal 
                                    product={modalData.product} 
                                    onCloseModal={closeModal} 
                                />
                            }
                        </Suspense>
                    </Modal>
                }

                {activeModal == 'delete' &&  
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <DeleteProductModal 
                                product={modalData.product} 
                                onCloseModal={closeModal} 
                                refetchProducts={refetch}
                            />
                        </Suspense>
                    </Modal>
                }    
            </div>
        </div>
    )
}

export default FarmerProducts;