import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/store';
import { CartFarmerGroupInterface } from '../cart.interface';
import CartDropdownProduct from './CartDropdownProduct';
import { handleCartItemIncrease, handleCartItemDecrease, handleRemoveCartItem } from '../../shared/utils/utilsFunctions';
import toast from 'react-hot-toast';
import { useWishlist } from '../../shared/hooks/useWishlist';

interface CartDropdownProps {
    isCustomer: boolean;
    cart: CartFarmerGroupInterface[];
    closeCartDropdown?: () => void;
}

const CartDropdown: FC<CartDropdownProps> = ({isCustomer, cart, closeCartDropdown }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { toggleWishlist, isInWishlist} = useWishlist();

    const onIncreaseProduct = (farmerID: string, productID: string):void => {
        handleCartItemIncrease(dispatch, farmerID, productID);
    }

    const onDecreseProduct = (farmerID: string, productID: string):void => {
        handleCartItemDecrease(dispatch, farmerID, productID);
    }

    const onRemoveProduct = (farmerID: string, productID: string):void => {
        handleRemoveCartItem(dispatch, farmerID, productID);
    }

    const onToggleWishlist = async(productID: string):Promise<void> =>{
        await toggleWishlist(productID);
    }

    const getTotalAmount = (farmerID: string):number => {
        const totalAmount = cart?.find(el => el.farmerID === farmerID)?.products
            .reduce((sum, product) => sum + product.quantity * product.price, 0) ?? 0;

        return Number(totalAmount.toFixed(2));
    }

    const handleMakeOrder =(farmerID: string):void =>{
        if(!isCustomer) {
            toast.error('You must be logged in to order');
            return;
        }

        navigate(`/order/${farmerID}`);
    }

    return (
        <div className='w-full flex flex-col'>
           <div className='w-full p-5 flex justify-between items-center'>
                <div className='text-xl hover:text-2xl cursor-pointer w-9' onClick={closeCartDropdown}>
                    {`<--`}
                </div>
                <h2 className='mx-auto font-semibold xs:text-lg'>
                    Your Shopping Cart
                </h2>
           </div>

           <div className='w-full flex flex-col gap-y-1'>
                {cart.length > 0
                    ?
                        cart.map(data => (
                        <div className='w-full border-t-2 border-greyB' key={data.farmerID}>
                            <div className='p-1 px-2'>
                                <p> Farmer: <span className='font-semibold'>{data.farmName}</span></p>
                            </div>

                            <div className='w-full max-w-screen-mda mx-autoa'>
                                {data.products.map(product => (
                                    <CartDropdownProduct 
                                        product={product}
                                        farmerID={data.farmerID!}
                                        isFavorite={isInWishlist}
                                        onIncreaseProduct={onIncreaseProduct}
                                        onDecreseProduct={onDecreseProduct}
                                        onRemoveProduct={onRemoveProduct}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                ))}
                            </div>

                            <div className='px-2 bg-red-300a pt-2 pb-6'>
                                <div className='flex justify-between items-center font-lato'>
                                    <div>
                                        Sub Total: <span className='font-semibold'>${getTotalAmount(data.farmerID!)}</span>
                                    </div>

                                    <div className=''>
                                        <button 
                                            className='
                                                px-4 py-2 text-white text-sm bg-green6 rounded
                                                hover:bg-green7 hover:font-medium
                                            '
                                            onClick={() => handleMakeOrder(data.farmerID!)}
                                        >
                                            Make Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    :
                        <div className='mt-1 ml-5 text-lg'>
                            Empty cart
                        </div>
                }
           </div>
        </div>
    )
}

export default CartDropdown