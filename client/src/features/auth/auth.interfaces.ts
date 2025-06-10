import { ObjectSchema } from "yup";
import { ValidationErrorMap } from "./hooks/useAuthValidation";

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

export interface AuthUserInterface {

    //with RTK Query reqeust we got props in camelCase (on testing with RESTClient .http we got lowcase props)
    id: string,
    username: string,
    email: string,
    userType: string,
    verificationEmailToken: string | null,
    resetPasswordToken: string | null,
    expireResetPassword: Date | null,
    createdAt: string, //redux toolkit use serializable data -> this have to be cast to string 
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


//on RTQ query HTTP request we should get a lot of different props
export interface ResponseInterface{
    message?: string,
    user?: AuthUserInterface
}

export interface SignUpPayloadInterface {
    username: string;
    email: string;
    password: string;
    repeatPassword: string,
    phoneNumber: string,
    userType: 'customer' | 'farmer';
    profilePicture: string;
    backgroundImage?: string; //for farmers
    fullName: string; 
    location?: LocationInterface | FarmerLocationInterface;
    farmName?: string;
    description?: string;
    socialLlinks?: string[];
}

//fullname is actually firstName + LastName 
export interface SignUpFormInterface {
    username: string;
    email: string;
    password: string;
    repeatPassword: string,
    phoneNumber: string,
    userType: 'customer' | 'farmer';
    profilePicture: string;
    backgroundImage?: string; //for farmers
    firstName: string;
    lastName: string;
    location?: LocationInterface | FarmerLocationInterface;
    farmName?: string;
    description?: string;
    socialLlinks?: string[];
}

export interface SignInPayloadInterface {
    usernameOrEmail: string;
    password: string;
}

export interface ResetPasswordPayloadInterface {
    email: string;
}

export interface useAuthValidationInterface{
    //allow only auth related schemas
    schema: ObjectSchema<SignInPayloadInterface | SignUpPayloadInterface | ResetPasswordPayloadInterface>; //specific schema
    userData: SignInPayloadInterface | SignUpPayloadInterface | ResetPasswordPayloadInterface;
}

export interface RoleOptionInterface {
    title: string,
    description: string,
    selected: boolean,
    icon: string;
    onSelect: () => void;
}

export interface CustomerFormOptionPropsInterface {
    userInfo: SignUpFormInterface;
    setUserInfo: React.Dispatch<React.SetStateAction<SignUpFormInterface>>;
    validationErrors: ValidationErrorMap; //-> Record<string,string> -> the useAuthValidation validation hook return value
    actionError: string;
}