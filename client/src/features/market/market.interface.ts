import { ProductDocumentInterface } from "../product/product.interface";
import { FarmerDocumentInterface } from "../farmer/farmer.interface";

export interface FilterInterface {
    category?: string;
    subCategories?: string[];
    location?: string;
    priceFrom?: number;
    priceTo?: number;
}

export interface FilterPropInterface {
    onFilterApply: (filters: FilterInterface) => void;
}

export interface MarketListInterface {
    mode: 'products' | 'farmers',
    items: ProductDocumentInterface[] | FarmerDocumentInterface[];
    // products?: ProductDocumentInterface[];
    // farmers?: FarmerDocumentInterface[];
    isLoading?: boolean;
}

export interface SortInterface {
    mode?: 'products' | 'farmers'
    sort?: 'relevant' | 'price_asc' | 'price_desc' | 'newest';
    size?: number;
}

export interface SearchParamsInterface {
    // Pagination related
    from?: number;
    size?: number;
    
    // Filters
    category?: string;
    subCategories?: string[];
    minPrice?: number;
    maxPrice?: number;
    
    // Sorting
    sort?: 'relevant' | 'price_asc' | 'price_desc' | 'newest';
    mode?: 'products' | 'farmers';
}

export interface ProductRelatedPropsInterface {
    productsCount: number; //products Length
    productCategory: string;
}

export interface SortPropInterface {
    onSortApply: (sorts: SortInterface) => void;
    productRelated: ProductRelatedPropsInterface;
}


