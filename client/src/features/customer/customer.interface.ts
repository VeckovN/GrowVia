import { LocationInterface } from "../auth/auth.interfaces";

export interface CustomerProfileInterface {
    firstName?:string,
    lastName?:string,
    phoneNumber?:string,
    location?: LocationInterface,
    profileAvatarFile?: string,
}

export interface CustomerUpdateProfilePropInterface {
    customerID: string,
    updateData: CustomerProfileInterface
}

export interface CustomerWishlistInterface {
    customerID: string,
    productID: string
}