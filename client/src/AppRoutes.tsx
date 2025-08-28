import { FC } from 'react';
import { Outlet, RouteObject, useRoutes } from 'react-router-dom';

import Index from './features/index/Index';
import MainLayout from './layouts/components/MainLayout';
import FarmerLayout from './layouts/components/FarmerLayout';
import CustomerLayout from './layouts/components/CustomerLayout';
import Market from './features/market/components/Market';
import ProductOverview from './features/product/components/ProductOverview';
import FarmerOverview from './features/farmer/components/FarmerOverview';
import FarmerOrders from './features/farmer/components/FarmerOrders';

import RequireCustomerOrGuestRoute from './features/RequireCustomerOrGuestRoute';
import RequireGuestRoute from './features/RequireGuestRoute';
import RequireAuthRoute from './features/RequireAuthRoute';

import SignIn from './features/auth/components/SignIn';
import SignUp from './features/auth/components/SignUp';
import ForgotPassword from './features/auth/components/ForgotPassword';
import ResetPassword from './features/auth/components/ResetPassword';
import ConfirmEmail from './features/auth/components/ConfirmEmail';
import Order from './features/order/pages/Order';
import Settings from './features/shared/user/Settings';
import OrderTrack from './features/order/pages/OrderTrack';
import OrderOverview from './features/order/pages/OrderOverview';

import FarmerDashboard from './features/farmer/components/FarmerDashboard';
import FarmerProducts from './features/farmer/components/FarmerProducts';
import FarmerProfile from './features/farmer/components/FarmerProfile';

import CustomerProfile from './features/customer/components/CustomerProfile';
import CustomerOrders from './features/customer/components/CustomerOrders';

import { ModalProvider } from './features/shared/context/ModalContext';


const AppRouter: FC = () => {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: (
                <RequireCustomerOrGuestRoute>
                    <MainLayout> 
                        <Index/> 
                    </MainLayout>
                </RequireCustomerOrGuestRoute> 
            )
        },
        {
            path: '/market',
            element: (
                <RequireCustomerOrGuestRoute>
                    <MainLayout> 
                        <Market/>  
                    </MainLayout>
                </RequireCustomerOrGuestRoute> 
            )
        },
        {
            path: '/farmers',
            element: (
                <RequireCustomerOrGuestRoute>
                    <MainLayout> 
                        <Market/>  
                    </MainLayout>
                </RequireCustomerOrGuestRoute> 
            )
        },
        {
            path: '/product/overview/:id',
            element: (
                <RequireCustomerOrGuestRoute>
                    <MainLayout> 
                        <ProductOverview />  
                    </MainLayout>
                </RequireCustomerOrGuestRoute> 
            )
        },
        {
            path: '/farmer/overview/:id',
            element: (
                <RequireCustomerOrGuestRoute>
                    <MainLayout> 
                        <FarmerOverview /> 
                    </MainLayout>
                </RequireCustomerOrGuestRoute> 
            )
        },

        //Signup/SignIn 
        //Main Layout with different Header->AuthHeader
        {
            path: '/signup',
            element: (
                <RequireGuestRoute>
                    <MainLayout authPage={true}> 
                        <SignUp/> 
                    </MainLayout>
                </RequireGuestRoute>
            )
        },
        {
            path: '/signin',
            element: (
                <RequireGuestRoute>
                    <MainLayout authPage={true}> 
                        <SignIn/>
                    </MainLayout>
                </RequireGuestRoute>
            )
        },
        {
            path: '/forgot-password',
            element: (
                <RequireGuestRoute>
                    <MainLayout authPage={true}> 
                        <ForgotPassword/>
                    </MainLayout>
                </RequireGuestRoute>
            )
        },
        { //When user click on "change Password" on received mail
            path: '/reset-password',
            element: (
                <RequireGuestRoute>
                    <MainLayout authPage={true}> 
                        <ResetPassword/>
                    </MainLayout>
                </RequireGuestRoute>
            )
        },
        
        //for logged users
        { //When user click on "change Password" on received mail
            path: '/confirm-email',
            element: (
                <RequireAuthRoute allowedRoles={['customer', 'farmer']}>
                    <ConfirmEmail/>
                </RequireAuthRoute>
            )
        },
        { 
            path: '/order/overview/:orderID',
            element: (
                <RequireAuthRoute allowedRoles={['customer', 'farmer']}>
                    <MainLayout >
                        <OrderOverview />
                    </MainLayout>
                </RequireAuthRoute>
            )
        },
        { 
            path: '/order/track/:orderID',
            element: (
                <RequireAuthRoute allowedRoles={['customer', 'farmer']}>
                    <MainLayout >
                        <OrderTrack />
                    </MainLayout>
                </RequireAuthRoute>
            )
        },
        { 
            path: '/order/:farmerID',
            element: (
                <RequireAuthRoute allowedRoles={['customer']}>
                    <MainLayout >
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
                {path:'orders', element: <CustomerOrders />}, 
                // {path:'wishlist', element: <CustomerWishlist />}, 
                {path:'settings', element: <Settings/>}, 
            ]
        }
    ]

    return useRoutes(routes);
}

export default AppRouter;