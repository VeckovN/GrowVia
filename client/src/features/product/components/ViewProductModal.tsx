import { useModal } from "../../shared/context/ModalContext";
import { ProductViewModalInterface } from "../product.interface";

const ViewProductModal = ({product, onCloseModal}:ProductViewModalInterface ) => {
    const { isOpen, activeModal, modalData, openModal, closeModal } = useModal();

    const onEditClick = ():void => {
        // onCloseModal();
        openModal('edit', {product}); //pass produc as modalData 
    }

    const onDeleteHanlder = ():void =>{
        openModal('delete', {product});
    }

    console.log("Product: ", product);

    return (  
        <div className='w-full px-5 xs:px-10 py-4 flex flex-col gap-8 bg-white '>
            {!product ? (
                <div className="">No product data</div>
            ) : (
            <>
            <div className='flex justify-between mb-2'>
                <h2 className='text-xl font-medium'>
                    {product.name}
                </h2>
                <button className='' onClick={onCloseModal}>
                    X
                </button>
            </div>

            <div className="sm:w-[70%] flex gap-8">
                <div className="flex flex-col items-start gap-1 font-light">
                    <div className="">
                        <div>Category: <span className="font-medium">{product.category}</span></div>
                    </div>
                    <div className="">
                        <div>Price: <span className="font-medium">${product.price}</span></div>
                    </div>
                    <div className="">
                        <div>Unit: <span className="font-medium">{product.unit}</span></div>
                    </div>
                    <div className="">
                        <div>Stock: <span className="font-medium">{product.stock}</span></div>
                    </div>
                </div>

                <div className='flex flex-col font-light'>
                    <ul className='list-disc'>Atributes
                        {product.subCategories?.map(prod => (
                            <li className="ml-6 font-medium"><span>T</span> {prod} </li>
                        ))
                        }
                    </ul>
                </div>
            </div>

            <div className='w-full'>
                <div className='text-xl '> Short Description</div>
                <p className='mt-2 text-sm text-gray-600 font-light'>{product.shortDescription}</p>
            </div>

            <div className='w-full'>
                <div className='text-xl '> Description</div>
                <p className='mt-2 text-sm text-gray-600 font-light'>{product.description}</p>
            </div>


            <div className='w-full'>
                <div className="flex gap-4 ">
                {product.images?.map(img => (
                    <div className='border greyB p-2 w-36 h-30 object-full'>
                        <img
                            src={img.url}
                        />
                    </div>
                ))}
                </div>
            </div>

            <div className='w-full flex bg-red gap-x-4 font-lato'>
                <button 
                    className='
                        border border-greyB w-24 h-8 bg-grey rounded-md text-sm
                        hover:bg-reda hover:font-semibold    
                    ' 
                    onClick={onEditClick}>
                        Edit
                </button>
                <button 
                    className='
                        border border-greyB w-24 h-8 bg-red-700 rounded-md text-sm text-white
                        hover:bg-red-800 hover:font-semibold
                    ' 
                    onClick={onDeleteHanlder}>
                        Delete
                    </button>
            </div>
            </>
            )}
        </div>
    )
}

export default ViewProductModal;