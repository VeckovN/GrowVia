import { Suspense, lazy, FC } from 'react';
import { useAppSelector } from '../../../store/store';
import { useModal } from '../../shared/context/ModalContext';
import { FarmerProductsTableInterface } from '../farmer.interface';
import { ReduxStateInterface } from '../../../store/store.interface';
import FarmerProductsTable from './ProductsTable/FarmerProductsTable';
import ViewProductModal from '../../product/components/ViewProductModal';
import { useGetProductByFarmerIDQuery } from '../../product/product.service';

// import AddProductModal from './Modals/AddProductModal';
import Modal from '../../shared/Modal';
import LoadingSpinner from '../../shared/page/LoadingSpinner';
import { CreateProductInterface, ProductDocumentInterface } from '../../product/product.interface';
import DeleteProductModal from '../../product/components/DeleteProductModal';

// const ProductForm = lazy() => import('../../product/components/ProductForm');

const ProductForm = lazy(() => import('../../product/components/ProductForm'));

const FarmerProducts:FC = () => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const { isOpen, activeModal, modalData, openModal, closeModal } = useModal();
    const {data, isLoading, isError} = useGetProductByFarmerIDQuery(authUser.id!);
    console.log("Data:" ,data);
    console.log("modalData");;

    const transformEditData = (productData: ProductDocumentInterface):Partial<CreateProductInterface> =>{
        const data = {
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
        return data;
    }
    
    return (     
        <div className='w-full'>
            <h2 className='hidden sm:block text-2xl font-medium'>
                Products
            </h2>

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

            <div className='filter-options mt-2 flex justify-end '>
                <button
                    className='
                        py-1 px-6 mb-2 border-2 border-greyB rounded-md bg-white text-sm
                        hover:bg-gray-300'
                    onClick={() => alert("Filter")}
                >
                    Filter
                </button>
            </div>

            <div className='w-full bg-red-4001'>
                {isLoading ? (
                    <div>Loading...</div>
                )
                : data?.products && data.products.length > 0
                    ? (
                        <div className='overflow-x-auto'>
                            <FarmerProductsTable
                                products={
                                    data.products
                                }
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
                            <ProductForm mode='create' farmerID={authUser.id!} onCloseModal={closeModal} / >
                        </Suspense>
                    </Modal>
                }

                {activeModal === 'edit' &&
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <ProductForm mode='edit' initialData={transformEditData(modalData.product!)} farmerID={authUser.id!} onCloseModal={closeModal} / >
                        </Suspense>
                    </Modal>
                }
                
                {activeModal == 'view' &&
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            {modalData.product &&
                                <ViewProductModal product={modalData.product} onCloseModal={closeModal} />
                            }
                        </Suspense>
                    </Modal>
                }

                {activeModal == 'delete' &&  
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <DeleteProductModal product={modalData.product} onCloseModal={closeModal} />
                        </Suspense>
                    </Modal>
                }    
            </div>
        </div>
    )
}

export default FarmerProducts;