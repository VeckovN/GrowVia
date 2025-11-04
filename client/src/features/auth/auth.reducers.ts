import { createSlice, Slice, PayloadAction} from "@reduxjs/toolkit";
import { AuthUserInterface, AuthUserWishlistItemInteface, FarmerLocationInterface } from "./auth.interfaces";
import { LocationInterface } from "./auth.interfaces";

export const initialAuthUser: AuthUserInterface = {
    id: '',
    username: '',
    email: '',
    phoneNumber: '',
    userType: '',
    verificationEmailToken: null,
    resetPasswordToken: null,
    expireResetPassword: null,
    createdAt: new Date().toISOString(),
    fullName: '',
    location: {} as LocationInterface | FarmerLocationInterface,
    profileAvatarFile: '',
    purchasedProducts: [],
    wishlist: [],
    savedFarmers: [],
    orderHistory: [],
    description: '',
    socialLinks: [],
};

const authSlice: Slice = createSlice({
    name: 'auth',
    initialState: initialAuthUser,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUserInterface>) => {
            return state = { ...action.payload };
        },
        updateAuthUser: (state, action: PayloadAction<Partial<AuthUserInterface>>) => {
            return state = { ...state, ...action.payload }
        },
        updateAuthUserWishlist: (state, action: PayloadAction<AuthUserWishlistItemInteface>) => {
            const { productID, actionType } = action.payload;

            if (!state.wishlist) {
                state.wishlist = [];
            }

            if(actionType === 'add'){
                if(!state.wishlist?.includes(productID)){
                    state.wishlist?.push(productID); 
                }
            }
            
            if(actionType === 'remove'){
                state.wishlist = state.wishlist?.filter(id => id !== productID)
            }
        },
        clearAuth: ()=> {
            return initialAuthUser 
        },
        verifyUserEmail: (state) =>{
            state.verificationEmailToken = null;
        }     
    }
});

export const { setAuthUser, updateAuthUser, updateAuthUserWishlist } = authSlice.actions;

//this export type fix type probelm with missing 1 argument
export const clearAuth = authSlice.actions.clearAuth as () => PayloadAction<undefined>;
export const verifyUserEmail = authSlice.actions.verifyUserEmail as () => PayloadAction<undefined>;

export default authSlice.reducer;

