import { ReactNode } from "react";
import { useGetCurrentUserQuery } from "./auth/auth.service";
import { Navigate } from "react-router-dom";

const RequireGuestRoute = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = useGetCurrentUserQuery();

    if (isLoading) return null;
    
    const userRole = data?.user?.userType;

    if(userRole === 'farmer') return <Navigate to='/farmer' replace/>
    if(userRole === 'customer') return <Navigate to='/' replace/>

    return <>{children}</>
};

export default RequireGuestRoute;