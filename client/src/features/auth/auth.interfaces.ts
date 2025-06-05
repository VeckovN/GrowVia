
// import {} //from user feature
export interface LocationInterface {
    country: string,
    city: string,
    address: string
}

export interface FarmerLocationInterface extends LocationInterface {
    latitude: string
    longitude: string
}

export interface AuthUserResponseInterface {
    id: string,
    username: string,
    email: string,
    usertype: string,
    verificationemailtoken: string | null,
    resetpasswordtoken: string | null,
    expireresetpassword: Date | null,
    createdat: Date,
    fullName: string,
    location: LocationInterface | FarmerLocationInterface,
    profilePicture: string,
    profilePublicID: string,
    //customer's related
    purchasedProducts?: string[],
    wishlist?: string[],
    savedFarmers?: string[],
    orderHistory?: string[],
    //farmer's related
    description?: string,
    socialLinks?: string[],
}

export interface SignUpPayloadInterface {
    username: string;
    email: string;
    password: string;
    userType: 'customer' | 'farmer';
    profilePicture: string;
    fullName: string;
    location: LocationInterface | FarmerLocationInterface;
    farmName?: string;
    description?: string;
    socialLlinks?: string[];
}

export interface SignInPayloadInterface {
    usernameOrEmail: string;
    password: string;
}
