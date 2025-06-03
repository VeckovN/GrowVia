import {FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';

import Index from './features/index/Index';
import MainLayout from './layouts/MainLayout';
import Market from './features/market/Market';

const AppRouter: FC = () => {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: <MainLayout> <Index/> </MainLayout>
        },
        {
            path: '/market',
            element: <MainLayout> <Market/> </MainLayout>
        },
        {
            path: '/farmers',
            element: <MainLayout> <Market/> </MainLayout>
        }
        
    ]

    return useRoutes(routes);
}

export default AppRouter;