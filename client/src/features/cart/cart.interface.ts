export interface CartProductInterface {
    productID: string;
    name: string;
    imageUrl: string;
    price: number;
    unit: string;
    quantity: number;
    totalPrice: string;
    favorite?:string;
}

export interface CartFarmerGroupInterface {
    farmerID?: string,
    farmName?: string;
    products : CartProductInterface[]
}

export interface CartStateInterface {
    //multiple products grouped by farmer 
    data: CartFarmerGroupInterface[];
}

export interface CartDropdownProductInterface {
    product: CartProductInterface;
    farmerID: string;
    onIncreaseProduct: (farmerID: string, productID: string) => void;
    onDecreseProduct:  (farmerID: string, productID: string) => void;
    onRemoveProduct: (farmerID: string, productID: string) => void;

}