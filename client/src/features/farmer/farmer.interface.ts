import { AuthUserInterface, FarmerLocationInterface } from "../auth/auth.interfaces";
import { ProductDocumentInterface } from "../product/product.interface";
import { ValidationErrorMap } from "../shared/hooks/useSchemaValidation";

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
    profileImagesFile?: string[],
    // profileAvatarImages?: string[],
    description?: string,
    socialLinks?: { name: string, url: string }[],
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
    profileImages?:
    {
        url: string;
        publicID: string;
    }[];
    //publicID's for images that will be removed from cloudinary
    removedImages?: [
        publicID: string 
    ]
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

export interface FarmerProductPaginationInterface { 
    sort?: 'newest' | 'oldest' | 'available'
    from?: number;
    size?: number;
    currentPage?: number;
    totalPages?: number;
}

export interface FarmerProductsTableProps {
    products: ProductDocumentInterface[];
    totalProducts: number;
    pagination: FarmerProductPaginationInterface;
    onPaginationChange: (newPagination: Partial<FarmerProductPaginationInterface>) => void;
}

export interface GalleryImageInterface {
    url: string,
    publicID: string,
}

export interface OrderFilterOptionsInterface {
    sort?: 'newest' | 'oldest' | 'requested' | 'accepted' | 'packaged' | 'toCurier' | 'delivered' | 'canceled';
    size?: number;
}

export interface ProfileHeaderProps {
    backgroundSrc: string;
    avatarSrc: string;
    backgroundInputRef: React.RefObject<HTMLInputElement | null>;
    avatarInputRef: React.RefObject<HTMLInputElement | null>;
    selectedImages: any;
    onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (type: 'avatar' | 'background') => void;
}

export interface InfoFormProps {
    userData: FarmerProfileInterface;
    authUser: AuthUserInterface;
    validationErrors: ValidationErrorMap;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    getBorderErrorStyle: (field: string) => string;
    handleSocialChange: (index: number, value: string) => void;
}

export interface ProfileImagesProps {
    existingImages: { url: string; publicID: string }[];
    previewImages: string[];
    onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveExisting: (index: number) => void;
    onRemovePreview: (index: number) => void;
}