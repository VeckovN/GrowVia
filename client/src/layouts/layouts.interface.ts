import { ReactNode } from "react";

export interface MainLayoutPropsInterface {
    children: ReactNode,
    authPage?: boolean;
}

export interface FarmerLayoutPropsInterface {
    children: ReactNode
}