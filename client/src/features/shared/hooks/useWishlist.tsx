import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { ReduxStateInterface } from '../../../store/store.interface';
import { updateAuthUserWishlist } from '../../auth/auth.reducers';
import { useAddItemToWishlistMutation, useRemovetItemFromWishlistMutation } from '../../customer/user.service';

interface UseWishlistReturnInterface {
    isInWishlist: (productID: string) => boolean;
    toggleWishlist: (productID: string) => Promise<void>;
}

export const useWishlist = (): UseWishlistReturnInterface => {
    const dispatch = useAppDispatch();

    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser);
    const wishlist = authUser.wishlist || [];

    const [addItemToWishlist] = useAddItemToWishlistMutation();
    const [removeItemFromWishlist] = useRemovetItemFromWishlistMutation();

    const isInWishlist = useCallback((productID: string): boolean => {
        return wishlist.includes(productID);
    }, [wishlist]);

    const toggleWishlist = useCallback(async(productID:string): Promise<void> => {
        const isProductInWishlist = wishlist.includes(productID);
        const actionType = isProductInWishlist ? 'remove' : 'add';

        dispatch(updateAuthUserWishlist({
            productID,
            actionType
        }));

        try{
            if(actionType === 'add'){
                await addItemToWishlist({
                    customerID: authUser.id!,
                    productID
                }).unwrap();
            } else {
                await removeItemFromWishlist({
                    customerID: authUser.id!,
                    productID
                }).unwrap();
            }
        }
        catch(error){
            const errorMessage = error?.data?.message || 'Failed to update wishlist. Please try again.';
            toast.error(errorMessage);
        }

    },[wishlist])

    return {
        isInWishlist,
        toggleWishlist
    }
}