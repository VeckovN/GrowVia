import { useAppSelector } from "../../../store/store";
import { ReduxStateInterface } from "../../../store/store.interface";
import toast from 'react-hot-toast';
import { DeleteViewModalInterface } from "../product.interface";
import { useDeleteProductMutation } from "../product.service";

const DeleteProductModal = ({product, onCloseModal}:DeleteViewModalInterface) => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const [deleteProduct] = useDeleteProductMutation();

    const onDeleteClick = async():Promise<void> => {
        if(!product){
            console.error("Product doesn't exist");
            return
        }
        const productID = product.id as string;
        const farmerID = authUser?.id?.toString();
        
        if (!farmerID) {
            console.error("Cannot delete: farmer ID is missing.");
            return;
        }

        const result = await deleteProduct({productID, farmerID});
        console.log("Result: ", result);

        toast.success("Product successfully deleted");
        //Re-fetch displayed products in list
        onCloseModal();
    }

    console.log("Product: ", product);
    if(!product) {
        console.error("There's no product");
        return;
    }
    return (     
        <div className='w-[90%]   mx-auto px-5 xs:px-10 py-4 flex flex-col gap-5 bg-white '>
            <div className='flex justify-between'>
                <h2 className='text-xl font-medium'>
                    Delete {product.name}
                </h2>
                <button className='' onClick={onCloseModal}>
                    X
                </button>
            </div>

            <div className='w-full flex  items-center flex-col'>
                <h3 className='mb-2 '> Are you sure to delete <span className='font-bold'>{product.name}</span> Product </h3>
                <div className="flex mx-auto gap-x-6">
                    <button className='border border-greyB w-24 h-8 bg-grey rounded-md text-sm' onClick={onCloseModal}>No</button>
                    <button className='border border-greyB w-24 h-8 bg-red-700 rounded-md text-sm text-white' onClick={onDeleteClick}>Delete it</button>
                </div>
            </div>
        </div>
    
    )
}

export default DeleteProductModal;