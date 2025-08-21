import { ReactNode, useEffect} from "react";
import { useGetCurrentUserQuery } from "./auth/auth.service";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const RequireAuthRoute = ({
    children,
    allowedRoles = ['customer', 'farmer']
}: {
    children: ReactNode,
    allowedRoles: string[]
}) => {
    //getCurrent user (not from redux -> from Authentication service ->
    //ofc jwtToken is inlcuded in req.session if the user is loggedIn  )
    const { data, error, isLoading } = useGetCurrentUserQuery();

    useEffect(() => {
        if (error) {
            toast.error('Authentication check failed');
        }
    }, [error]);

    if (isLoading) return null;

    const userRole = data?.user?.userType;

    // Handle unauthenticated users
    if (!userRole) {
        toast.error('Please sign in to access this page');
        return <Navigate to="/signin" replace />;
    }

    // Handle unauthorized roles
    if (!allowedRoles.includes(userRole)) {
        toast.error("You don't have permission to access this resource");
        
        if(userRole === 'farmer') return <Navigate to='/farmer' replace/>
        if(userRole === 'customer') return <Navigate to='/' replace/>
    }

    return <>{children}</>
};

export default RequireAuthRoute;