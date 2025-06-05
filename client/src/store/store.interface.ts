export interface reduxStateInterface {
    authUser: object, //replace with AuthInterface
    customer: object, //replace with CustomerInterface
    farmer: object, //replace with FarmerInterface
    //Or merged user data -> authData + customer/farmerData 
    // authUser: AuthUserInterface
    cart: object
    notification: object //replace with NotificationInterface
}