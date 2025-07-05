import { createSlice, Slice, PayloadAction} from "@reduxjs/toolkit";

import { AuthUserInterface, FarmerLocationInterface } from "./auth.interfaces";
import { LocationInterface } from "./auth.interfaces";

//Consider useing "Async Trunks " used for
// -Tracking {IsLoading, isSuccess and error states during }
// -side Effects (to dispatch multiple actions (eg. setAuthUser + resetCart on logout)

export const initialAuthUser: AuthUserInterface = {
    id: '',
    username: '',
    email: '',
    phoneNumber: '',
    userType: '',
    verificationEmailToken: null,
    resetPasswordToken: null,
    expireResetPassword: null,
    //   createdAt: new Date(), not serializable data allowed in redux-toolkit
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
        clearAuth: ()=> {
            return initialAuthUser 
        },
        verifyUserEmail: (state) =>{
            state.verificationEmailToken = null;
        }     
    }
});

export const { setAuthUser, updateAuthUser } = authSlice.actions;

//thus export type fix type probelm with missing 1 argument
export const clearAuth = authSlice.actions.clearAuth as () => PayloadAction<undefined>;
export const verifyUserEmail = authSlice.actions.verifyUserEmail as () => PayloadAction<undefined>;

export default authSlice.reducer;

