import { ReactNode } from "react";
import { useGetCurrentUserQuery } from "./auth/auth.service";
import { Navigate } from "react-router-dom";

const RequireCustomerOrGuestRoute = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = useGetCurrentUserQuery();

    if (isLoading) return null;

    const userRole = data?.user?.userType;

    if(userRole === 'farmer') return <Navigate to='/farmer' replace/>

    return <>{children}</>
};

export default RequireCustomerOrGuestRoute;