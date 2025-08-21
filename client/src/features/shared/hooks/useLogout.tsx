import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { useLogoutMutation } from "../../auth/auth.service";
import { removeUserFromSessionStorage } from "../utils/utilsFunctions";
import { clearAuth } from "../../auth/auth.reducers";
import { clearNotifications } from "../../notifications/notifications.reducers";
import { toast } from 'react-hot-toast';

const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [logout] = useLogoutMutation();

    const logoutHanlder = async():Promise<void> => {
        try{
            await logout();
            dispatch(clearAuth());
            dispatch(clearNotifications());
            removeUserFromSessionStorage();
            toast.success("You're logged out");
            navigate('/signin');
        }
        catch(error){
            console.error("Logout error: ", error);
            toast.error("Logout failed. Please try again.");
        }
    }

    return logoutHanlder;
}

export default useLogout;