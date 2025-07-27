import { AppDispatch } from "../../../store/store";
import { CartProductInterface } from "../../cart/cart.interface";
import { addProduct, increaseProduct, decreaseProduct, removeProduct } from "../../cart/cart.reducers";

export const saveDataToLocalStorage = (key: string, data: string): void =>{
    //data object should be JSON stringified
    window.localStorage.setItem(key, data);
}

export const getDataFromLocalStorage = (key: string) =>{
    const data:string = window.localStorage.getItem(key) as string;
    return JSON.parse(data); //convert from string to JSON object
}

export const removeDataFromLocalStorage = (key:string): void => {
    window.localStorage.removeItem(key);
}

export const saveDataToSessionStorage = (data: string, username: string): void =>{
    window.sessionStorage.setItem('isLoggedIn', data); //true/false
    window.sessionStorage.setItem('loggedInUser', username); //
}

export const removeUserFromSessionStorage = (): void => {
    window.sessionStorage.removeItem('isLoggedIn'); 
    window.sessionStorage.removeItem('loggedInUser'); 
}

export const getDataFromSessionStorage = (key: string) => {
    const data:string = window.sessionStorage.getItem(key) as string;
    return JSON.parse(data);
}

export const removeDataFromSessionStorege = (key: string) =>{
    window.sessionStorage.removeItem(key);
}

export const readAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const handleAddToCart = (
    dispatch: AppDispatch,
    farmerID: string,
    farmName: string,
    product: CartProductInterface
): void => {
    dispatch(addProduct({farmerID, farmName, product}));
}

export const handleCartItemIncrease = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(increaseProduct({farmerID, productID}));
}

export const handleCartItemDecrease = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(decreaseProduct({farmerID, productID}));
}

export const handleRemoveCartItem = (
    dispatch: AppDispatch,
    farmerID: string,
    productID: string
): void => {
    dispatch(removeProduct({farmerID, productID}));
}
