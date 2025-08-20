import { AuthUserInterface } from '../features/auth/auth.interfaces';
import { CartStateInterface } from '../features/cart/cart.interface';
import { NotificationsStateInterface } from '../features/notifications/notifications.interface';

//used as state interface in useAppSelector 
export interface ReduxStateInterface {
    authUser: AuthUserInterface, 
    cart: CartStateInterface,
    notifications: NotificationsStateInterface 
}