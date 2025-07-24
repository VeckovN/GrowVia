import { AuthUserInterface } from '../features/auth/auth.interfaces';
import { CartStateInterface } from '../features/cart/cart.interface';

//used as state interface in useAppSelector 
export interface ReduxStateInterface {
    authUser: AuthUserInterface, 
    customer: object, //replace with CustomerInterface
    farmer: object, //replace with FarmerInterface
    //Or merged user data -> authData + customer/farmerData 
    // authUser: AuthUserInterface
    // cart: object,
    cart: CartStateInterface,
    notification: object //replace with NotificationInterface
}