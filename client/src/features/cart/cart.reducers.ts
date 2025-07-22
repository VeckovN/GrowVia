import { createSlice, Slice, PayloadAction} from "@reduxjs/toolkit";
// import { CartProductInterface, FarmerCartGroupInterface, CartStateInterface} from "./cart.interface";
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
            if (product) product.quantity += 1;
        },
        // like "-"
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
                }
            }
        },
        // remove whole product from cart
        removeProduct: (
            state,
            action: PayloadAction<{ farmerID: string; productID: string }>
        ) => {
            const group = state.data.find(f => f.farmerID === action.payload.farmerID);
            if (group) {
                group.products = group.products.filter(p => p.productID !== action.payload.productID);
                if (group.products.length === 0) {
                // remove entire farmer group if no more products
                state.data = state.data.filter(f => f.farmerID !== action.payload.farmerID);
                }
            }
        },

        clearCart: (state) => {
            state.data = [];
        }
        
    }
});

export const clearCart = cartSlice.actions.clearCart as () => PayloadAction<undefined>;
export const { addProduct, increaseProduct, decreaseProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;

