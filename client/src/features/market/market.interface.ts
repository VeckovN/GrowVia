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
    isLoading?: boolean;
}

export interface MarketFarmerCardInterface {
    farmer: FarmerDocumentInterface;
}

export interface SortInterface {
    mode?: 'products' | 'farmers'
    sort?: 'relevant' | 'price_asc' | 'price_desc' | 'newest';
    size?: number;
}

export interface SearchParamsInterface {
    //Text search for products
    query?: string;
    //Text serach for farmers
    farmerQuery?: string;

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
    mode: "products" | "farmers";
    onModeChange: (mode: "products" | "farmers") => void;
    onSortApply: (sorts: SortInterface) => void;
    onFarmerSearch: (farmerQuery: string) => void;
    productRelated: ProductRelatedPropsInterface;
}


