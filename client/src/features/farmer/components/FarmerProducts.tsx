import { Suspense, lazy } from 'react';
import { useAppSelector } from '../../../store/store';
import { useModal } from '../../shared/context/ModalContext';
import { FarmerProductsTableInterface } from '../farmer.interface';
import { ReduxStateInterface } from '../../../store/store.interface';
import FarmerProductsTable from './ProductsTable/FarmerProductsTable';

// import AddProductModal from './Modals/AddProductModal';
import Modal from '../../shared/Modal';
import LoadingSpinner from '../../shared/page/LoadingSpinner';

// const ProductForm = lazy() => import('../../product/components/ProductForm');

const ProductForm = lazy(() => import('../../product/components/ProductForm'));

const FarmerProducts = () => {
    const products: FarmerProductsTableInterface[] = [
        { id: '1312', name: 'Organic Apples', category: 'Fruits', price: 2.99, stock: 150, unit: 'kg' },
        { id: '1313', name: 'Carrots', category: 'Vegetables', price: 1.49, stock: 200, unit: 'kg' },
        { id: '1314', name: 'Milk', category: 'Dairy', price: 3.50, stock: 50, unit: 'l' },
        { id: '1315', name: 'Eggs', category: 'Poultry', price: 4.99, stock: 120, unit: 'dozen' },
        { id: '1316', name: 'Wheat Flour', category: 'Grains', price: 2.20, stock: 80, unit: 'kg' }
    ]
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const { isOpen, activeModal, openModal, closeModal } = useModal();

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
                {products.length > 0
                    ?
                    <div className='overflow-x-autoa'>
                        <FarmerProductsTable
                            products={products}
                        />
                    </div>
                    :
                    <div className=''>
                        You don't have products
                    </div>
                }

                {activeModal === 'add' &&
                <>
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            {/* <AddProductModal farmerID={authUser.id} onCloseModal={closeModal} /> */}
                            <ProductForm mode='create' farmerID={authUser.id!} onCloseModal={closeModal} / >
                        </Suspense>
                    </Modal>
                </>
                }

                {activeModal === 'edit' &&
                <>
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            {/* <AddProductModal farmerID={authUser.id} onCloseModal={closeModal} /> */}
                            <ProductForm mode='edit'  farmerID={authUser.id!} onCloseModal={closeModal} / >
                        </Suspense>
                    </Modal>
                </>
                }
                
                {/* {activeModal == 'view' &&
                <>
                    <Modal closeModal={closeModal}>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <ViewProductModal onCloseModal={closeModal} />
                        </Suspense>
                    </Modal>
                </>
                } */}
            
                
            </div>
        </div>
    )
}

export default FarmerProducts;