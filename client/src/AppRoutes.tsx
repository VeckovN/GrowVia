import {FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';

import Index from './features/index/Index';
import MainLayout from './layouts/components/MainLayout';
import Market from './features/market/Market';

import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import ForgotPassword from './features/auth/components/ForgotPassword';
import ResetPassword from './features/auth/components/ResetPassword';
import ConfirmEmail from './features/auth/components/ConfirmEmail';

import RequireAuthRoute from './features/RequireAuthRoute';

const AppRouter: FC = () => {
    const routes: RouteObject[] = [
        //Main Layout
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
        },

        //Signup/SignIn 
        //Main Layout with different Header->AuthHeader
        {
            path: '/signup',
            element: <MainLayout authPage={true}> <SignUp/> </MainLayout>
        },
        {
            path: '/signin',
            element: <MainLayout authPage={true}> <SignIn/> </MainLayout>
        },
        {
            path: '/forgot-password',
            element: <MainLayout authPage={true}> <ForgotPassword/> </MainLayout>
        },
        { //When user click on "change Password" on received mail
            path: '/reset-password',
            element: <MainLayout authPage={true}> <ResetPassword/> </MainLayout>
        },
        //for logged users
        { //When user click on "change Password" on received mail
            path: '/confirm-email',
            element: (
                <RequireAuthRoute allowedRoles={['customer', 'farmer']}>
                    <ConfirmEmail/>
                </RequireAuthRoute>
            )
            // element: <MainLayout authPage={true}> <ConfirmEmail/> </MainLayout>
        }
        
    ]

    return useRoutes(routes);
}

export default AppRouter;