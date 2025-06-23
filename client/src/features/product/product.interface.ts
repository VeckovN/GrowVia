import { UnitType } from "../shared/utils/data"

export interface CreateProductInterface {
    farmerID: string;
    name: string;
    images?: string[];
    description: string;
    shortDescription: string;
    category: string;
    subCategories: string[];
    price: number | null;
    stock: number | null;
    unit: UnitType | null;
    tags: string[];
}

export interface ProductDocumentInterface {
    // _id?: string | ObjectId; 
    _id?: string  
    // id?: string | ObjectId;
    id?: string;
    // farmerID?: string | ObjectId;
    farmerID?: string;
    name: string;
    images?: [
        {
            url: string;
            publicID: string;
        }
    ];
    description: string;
    shortDescription?: string;
    category: string;
    subCategories?: string[];
    price: number;
    stock: number;
    unit: UnitType;
    tags: string[];
    createdAt?: Date | string;
    toJSON?: () => unknown;
}

export interface ProductFormInterface {
    mode: 'create' | 'edit';
    // initialData: Omit<CreateProductInterface, 'farmerID' >; //Intial(add Form) or fetched(edit Form)
    initialData?: Partial<CreateProductInterface>; // Optional for edit mode
    farmerID: number; //number type got from Authentication service Login -> Redux state
    onCloseModal: () => void;
}

export interface ProductViewModalInterface {
    onCloseModal: ()=> void,
    product?: ProductDocumentInterface, 
}

export interface DeleteViewModalInterface {
    onCloseModal: ()=> void,
    product?: ProductDocumentInterface, 
}
