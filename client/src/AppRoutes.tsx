import {FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';

// import MainPage from './features/MainPage';
import Index from './features/index/Index';

const AppRouter: FC = () => {
    const routes: RouteObject[] = [
        // {
        //     path: '/',
        //     element: <MainPage /> //This return Index(for Guest -NotLoggedUser) or Home page (for logged customer) based on auth value
        // },
        {
            path: '/',
            element: <Index />
        },
        
    ]

    return useRoutes(routes);
}

export default AppRouter;