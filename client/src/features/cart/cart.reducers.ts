import { createSlice, Slice, PayloadAction} from "@reduxjs/toolkit";
import { CartProductInterface, CartStateInterface} from "./cart.interface";

export const initialCart: CartStateInterface = {
    data:[]
};

const cartSlice: Slice = createSlice({
    name: 'cart',
    initialState: initialCart,
    reducers: {
        //add cart to product (from market or other page -> amount is passed as well)
        addProduct: (
            state, 
            action: PayloadAction<{farmerID: string, farmName:string, product:CartProductInterface}>
        ) => {
            const { farmerID, farmName, product } = action.payload;
            const farmerGroup = state.data.find(f => f.farmerID === farmerID);

            if (farmerGroup) {
                const existingProduct = farmerGroup.products.find(p => p.productID === product.productID);
                
                if (existingProduct) {
                    existingProduct.quantity += product.quantity;
                    existingProduct.totalPrice = (existingProduct.quantity * existingProduct.price).toFixed(2);
                } else {
                    farmerGroup.products.push(product);
                }
            } else {
                state.data.push({
                    farmerID,
                    farmName,
                    products: [product]
                })
            }
        },
        increaseProduct: (
            state,
            action: PayloadAction<{ farmerID: string; productID: string }>
        ) => {
            const group = state.data.find(f => f.farmerID === action.payload.farmerID);
            const product = group?.products.find(p => p.productID === action.payload.productID);
            if (product) {
                product.quantity += 1; // incremented immediately
                product.totalPrice = (product.quantity * product.price).toFixed(2);
            }
        },
        decreaseProduct: (
            state,
            action: PayloadAction<{ farmerID: string; productID: string }>
        ) => {
            const group = state.data.find(f => f.farmerID === action.payload.farmerID);
            const product = group?.products.find(p => p.productID === action.payload.productID);
            if (product) {
                if (product.quantity <= 1) {
                    group.products = group.products.filter(p => p.productID !== action.payload.productID);
                }
                else{
                    product.quantity -= 1;
                    product.totalPrice = (product.quantity * product.price).toFixed(2);
                }
            }

            if(group.products.length === 0){
                state.data = state.data.filter(f => f.farmerID !== action.payload.farmerID)
            }
        },
        removeProduct: (
            state,
            action: PayloadAction<{ farmerID: string; productID: string }>
        ) => {
            const group = state.data.find(f => f.farmerID === action.payload.farmerID);
            
            if(!group) return;

            group.products = group.products.filter(p => p.productID !== action.payload.productID);
            
            if (group.products.length === 0) {
                // remove entire farmer group if no more products
                state.data = state.data.filter(f => f.farmerID !== action.payload.farmerID);
            }

        },
        //on Make order remove the whole group 
        removeGroup: (
            state,
            action: PayloadAction<{ farmerID: string }>
        ) => {
            state.data = state.data.filter(f => f.farmerID !== action.payload.farmerID);
        },

        clearCart: (state) => {
            state.data = [];
        }
    }
});

export const clearCart = cartSlice.actions.clearCart as () => PayloadAction<undefined>;
export const { addProduct, increaseProduct, decreaseProduct, removeProduct, removeGroup } = cartSlice.actions;
export default cartSlice.reducer;

