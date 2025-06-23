import { useModal } from '../../../shared/context/ModalContext';
import { ProductDocumentInterface } from '../../../product/product.interface';
import EyeIcon from '../../../../assets/farmers/eye.svg';
import EditIcon from '../../../../assets/farmers/edit.svg';
import TrashIcon from '../../../../assets/farmers/trash.svg';

const ActionDropdown = ( {product} : { product: ProductDocumentInterface }) => {
    const { openModal } = useModal();
    
    return (
        <div className='flex flex-col w-32 bg-gray-50 w-full border-2 border-grey rounded-md font-normal'>
            <div 
                className='relative p-1 items-center flex hover:bg-gray-100 cursor-pointer'
                onClick={() => openModal('view', {product})}
            >
                <img
                    className=' ml-1 w-6 h-6'
                    src={EyeIcon}
                    alt='eye'
                />
                <div className='pl-5 text-gray-600'>View</div>
            </div>

            <div 
                className='relative p-1 items-center flex hover:bg-gray-100 cursor-pointer'
                onClick={() => openModal('edit', {product})}
            >
                <img
                    className=' ml-2 w-4 h-4'
                    src={EditIcon}
                    alt='eye'
                />
                <div className='pl-6 text-gray-600'>Edit</div>
            </div>

            <div 
                className='relative p-1 items-center flex hover:bg-red-50 cursor-pointer'
                onClick={() => openModal('delete', {product})}
            >
                <img
                    className='ml-2 w-4 h-4'
                    src={TrashIcon}
                    alt='eye'
                />
                <div className='pl-6 text-red-500'>Delete</div>
            </div>
        </div>
    )
}

export default ActionDropdown