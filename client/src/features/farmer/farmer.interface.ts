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
    socialLinks?: { name: string, url: string }[],
}

export interface FarmerSettingsPropInterface {
    currentPassword: string,
    newPassword: string,
    repeatPassword: string,
}

export interface FarmerDocumentInterface {
    userID?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    profileAvatarFile?: string;
    backgroundImageFile?: string;
    profileImagesFile?: string;
    ImageFiles?: {
        profileAvatarFile: string;
        backgroundImageFile: string;
        profileImagesFile: string[];
    };
    profileAvatar?: {
        url: string;
        publicID: string;
    };
    backgroundImage?: {
        url: string;
        publicID: string;
    };
    profileImages?: [
        {
            url: string;
            publicID: string;
        }
    ];
    fullName?: string;
    farmName?: string;
    location?: {
        country?: string;
        city?: string;
        address?: string;
        latitude?: string;
        longitude?: string;
    } | null;
    description?: string;
    socialLinks?: string[];
    totalProducts?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface GalleryImageInterface {
    url: string,
    publicID: string,
}
