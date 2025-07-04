import { FarmerLocationInterface } from "../auth/auth.interfaces";

export interface FarmerProductsTableInterface {
    id: string,
    name: string,
    category: string,
    price: number,
    stock: number,
    unit: string
}

export interface FarmerProfileInterface {
    farmName?:string,
    // username: string,
    // email?: string,
    firstName?:string,
    lastName?:string,
    // fullName?: string,
    phoneNumber?:string,
    location?: FarmerLocationInterface,
    profileAvatarFile?: string,
    backgroundImageFile?: string,
    // profileAvatarImages?: string[],
    description?: string,
    socialLinks?: [{ name: string, url: string }],
}

export interface FarmerSettingsPropInterface {
    currentPassword: string,
    newPassword: string,
    repeatPassword: string,
}