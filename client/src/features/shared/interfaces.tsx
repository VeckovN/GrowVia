import React, { ChangeEvent } from 'react';
import { AuthUserInterface } from '../auth/auth.interfaces';
import { ObjectSchema, AnyObject } from 'yup';
import { ProductDocumentInterface } from '../product/product.interface';
import { FarmerDocumentInterface } from '../farmer/farmer.interface';
import { OrderDocumentInterface } from '../order/order.interface';
import { NotificationInterface } from '../notifications/notifications.interface';
import { UnitType } from './utils/data';

export interface CircleIconButtonInterface {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export interface MarketplaceInfoInterface {
    title: string,
    description: string,
    icon: string
}

export interface HeaderIconBadgeInterface {
    icon: string,
    alt: string,
    // content?: string, //badge content (count)
    content?: number, //badge content (count)
    text?: string,
    textClassName?:string, //additional classes for text div
    className?: string, //additional parrent div classes
    hiddenText?:boolean,
    onClick: () => void;
}

export interface TextFieldPropsInterface {
    className?: string;
    id?: string;
    name?: string;
    type?: string;
    value?: string | number;
    placeholder?: string;
    readOnly?: boolean;
    checked?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    min?: string | number;
    max?: string | number;
    disabled?: boolean;
    // onChange?: (event: React.ChangeEvent) => void; => ChangeEvent is too generic
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; 
    onClick?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyUp?: () => void;
    // onKeyDown?: (event: KeyboardEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface SelectFieldPropsInterface {
    id: string;
    name: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string; label: string }>;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

//Generic interface
//on RTQ query HTTP request we should get a lot of different props *based on service
export interface ResponseInterface{
    token?: string;
    message?: string;
    user?: AuthUserInterface; //we got response for authUser like {message, user} => on ApiGateway as res.json({message,user})
    product?: ProductDocumentInterface;
    products?: ProductDocumentInterface[];
    farmers?: FarmerDocumentInterface[]; 
    farmer?: FarmerDocumentInterface; 
    order?: OrderDocumentInterface
    orders?: OrderDocumentInterface[];
    notification?: NotificationInterface;
    notifications?: NotificationInterface[];
    //TO DO: Refactor gateway response props -> replace '{user} with respective user type -> 
    //For 'Farmer related requestes return 'farmer' instead of 'user' and 'customer' instead of 'user' as well 
    total?: number; //for elasticSearch total results
}

export interface PaginationInterface {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface CategoryItemPropsInterface {
    id: string | number,
    name: string,
    icon: string
    onCategoryClick?: () => void;
}


export interface ProfileDropdownProps {
    authUser: AuthUserInterface;
    closeProfileDropdown?: () => void;
}

export interface UseSchemaValidationPropsInterface<T extends AnyObject> {  // <-- Add constraint here
  schema: ObjectSchema<T>;
  userData: T;
}

export interface ProductItemInterface {
    id:string,
    name:string,
    category:string,
    unit: UnitType;
    farmerID: string,
    farmName:string,
    farmerLocation:{
        country?: string,
        city?: string,
        address?:string
    },
    price:number,
    favorite?:boolean, 
    image:{
        url:string,
        publicID: string
    },
}

export interface FarmerItemInterface {
    id: string,
    name:string,
    location: {
        // country?: string;
        city?: string;
        address?: string;
    }
    avatar: {
        url: string;
        publicID: string;
    }
    background: {
        url: string;
        publicID: string;
    }
}

export interface SlideListInterface {
    title:string,
    data?: ProductDocumentInterface[],
    isLoading?: boolean
}

export interface BreadcrumbsPropsInterface {
  items: {
    label: string,
    href?: string
  }[]
}

export interface VisibleCountConfig {
    mobile: number,
    tablet: number,
    desktop: number
}
