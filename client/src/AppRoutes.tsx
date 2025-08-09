import {FC, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes } from 'react-router-dom';

import Index from './features/index/Index';
import MainLayout from './layouts/components/MainLayout';
import FarmerLayout from './layouts/components/FarmerLayout';
import CustomerLayout from './layouts/components/CustomerLayout';
import Market from './features/market/components/Market';
import ProductOverview from './features/product/components/ProductOverview';
import FarmerOverview from './features/farmer/components/FarmerOverview';
import FarmerOrders from './features/farmer/components/FarmerOrders';

import RequireAuthRoute from './features/RequireAuthRoute';

import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import ForgotPassword from './features/auth/components/ForgotPassword';
import ResetPassword from './features/auth/components/ResetPassword';
import ConfirmEmail from './features/auth/components/ConfirmEmail';
import Order from './features/order/pages/Order';
import Settings from './features/shared/user/Settings';

import FarmerDashboard from './features/farmer/components/FarmerDashboard';
import FarmerProducts from './features/farmer/components/FarmerProducts';
import FarmerProfile from './features/farmer/components/FarmerProfile';
// import FarmerSettings from './features/farmer/components/FarmerSettings';

import CustomerProfile from './features/customer/components/CustomerProfile';

import { ModalProvider } from './features/shared/context/ModalContext';


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
        },

        {
            path: '/product/overview/:id',
            element: <MainLayout> <ProductOverview /> </MainLayout>
        },

        {
            path: '/farmer/overview/:id',
            element: <MainLayout> <FarmerOverview /> </MainLayout>
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
        },
        // { 
        //     path: '/order/overview/:orderID',
        //     element: (
        //         <RequireAuthRoute allowedRoles={['customer', 'farmer']}>
        //             <MainLayout >
        //                 <OrderOverview >
        //             </MainLayout>
        //         </RequireAuthRoute>
        //     )
        // },
        { 
            path: '/order/:farmerID',
            element: (
                <RequireAuthRoute allowedRoles={['customer']}>
                    <MainLayout >
                        {/* Order Page */}
                        <Order/> 
                    </MainLayout>
                </RequireAuthRoute>
            )
        },
        {
            path: '/farmer',
            element: (
                <RequireAuthRoute allowedRoles={['farmer']}>
                    <FarmerLayout> <Outlet/> </FarmerLayout>
                </RequireAuthRoute>
            ),
            children: [
                // {path:'dashboard', element: <FarmerDashboard />}, 
                {index: true, element: <FarmerDashboard />}, 
                {path:'profile', element: <FarmerProfile />}, 
                {
                    path:'products', 
                    element: 
                    //Wrap ModalProvier here not in main.tsx -> better for performance (scope reduced) 
                    //The modals is only here in FarmerProducts needed
                        <ModalProvider>
                            <FarmerProducts />
                        </ModalProvider>
                    }, 
                {path:'orders', element: <FarmerOrders />}, 
                {path:'settings', element: <Settings/>}, 
            ]
        },

        // Combine MainLayout and CustomerLayout to keep the global Header at the top
        // By nesting CustomerLayout inside MainLayout, the Header stays consistent across pages
        // without needing to manually include it in CustomerLayout.
        {
            path: '/customer',
            element: (
                <RequireAuthRoute allowedRoles={['customer']}>
                    <MainLayout>
                        <CustomerLayout> <Outlet/> </CustomerLayout>
                    </MainLayout>
                </RequireAuthRoute>
            ),
            children: [
                {path:'profile', element: <CustomerProfile/>},  
                // {path:'orders', element: <CustomerOrders />}, 
                // {path:'wishlist', element: <CustomerWishlist />}, 
                {path:'settings', element: <Settings/>}, 
            ]
        }

    ]

    return useRoutes(routes);
}

export default AppRouter;