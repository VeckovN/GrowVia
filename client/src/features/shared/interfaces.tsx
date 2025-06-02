import React from 'react';

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

export interface CustomerAuthInterface {
    
}

export interface HeaderInterface {
    userType: string,
    user: CustomerAuthInterface | null ;
}

export interface HeaderIconBadgeInterface {
    icon: string,
    alt: string,
    content?: string, //badge content (count)
    text?: string,
    textClassName?:string, //additional classes for text div
    className?: string, //additional parrent div classes
    onClick: () => void;
}