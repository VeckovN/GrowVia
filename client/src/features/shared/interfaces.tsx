import React, { ChangeEvent, KeyboardEvent } from 'react';
import { AuthUserInterface } from '../auth/auth.interfaces';

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
    content?: string, //badge content (count)
    text?: string,
    textClassName?:string, //additional classes for text div
    className?: string, //additional parrent div classes
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
}

//Generic interface
//on RTQ query HTTP request we should get a lot of different props *based on service
export interface ResponseInterface{
    token?: string;
    message?: string;
    user?: AuthUserInterface; //we got response for authUser like {message, user} => on ApiGateway as res.json({message,user})
}