import { ObjectSchema } from "yup";
import { ValidationErrorMap } from "../shared/hooks/useSchemaValidation";

export interface LocationInterface {
    country?: string,
    city: string,
    address: string
}

export interface FarmerLocationInterface extends LocationInterface {
    latitude: number | null,
    longitude: number | null
}

export interface AuthUserInterface {
    id: string | null, //it's number IN Authentication Service
    username: string,
    email: string,
    phoneNumber: string,
    userType: string,
    verificationEmailToken: string | null,
    resetPasswordToken: string | null,
    expireResetPassword: Date | null,
    createdAt: string, //redux toolkit use serializable data -> this have to be cast to string 
    fullName: string,
    location: LocationInterface | FarmerLocationInterface,
    profileAvatarFile: string;
    profileAvatar?: {
        url: string,
        publicID: string
    },
    backgroundImageFile?:string;
    backgroundImage?: { //onyl for farmer
        url: string,
        publicID: string
    },
    profileImages?: [{ //onyl for farmer
        url: string,
        publicID: string
    }],

    //customer's related
    purchasedProducts?: string[],
    wishlist?: string[],
    savedFarmers?: string[],
    orderHistory?: string[],
    //farmer's related
    farmName?:string,
    description?: string,
    socialLinks?: string[],
}

export interface SignUpPayloadInterface {
    username: string;
    email: string;
    password: string;
    repeatPassword: string,
    phoneNumber: string,
    userType: 'customer' | 'farmer';
    // profilePicture: string;
    avatarImageFile?: string;
    backgroundImageFile?: string;
    // profileImages?: string[];
    profileImagesFile?: string[];
    // backgroundImage?: string; //for farmers
    fullName: string; 
    location?: LocationInterface | FarmerLocationInterface;
    farmName?: string;
    description?: string;
    socialLlinks?: string[];
}

export interface BaseSignUpFormInterface {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    location?: LocationInterface;
    profileAvatarFile?: string;
}

export interface SignUpCustomerFormInterface extends BaseSignUpFormInterface {
    userType: 'customer';
    // No additional fields needed
}

// //Same as SignUpFormInterface
// export interface SignUpCustomerFormInterface extends SignUpFormInterface {
// }

export interface SignUpFarmerFormInterface extends BaseSignUpFormInterface {
    userType: 'farmer';
    farmName?: string;
    // profileAvatarFile: string;
    backgroundImageFile?: string;
    // profileImagesFile?: string[]; //adding profile images will be allowed in user profil
    description?: string;
    socialLlinks?: string[];
}

//Union for userInfo SignUp state
export interface SignUpFormUnionInterface {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    location?: LocationInterface;
    profileAvatarFile?: string;
    userType: 'customer' | 'farmer';
    farmName?: string;
    backgroundImageFile?: string;
    // profileImagesFile?: string[]; //adding profile images will be allowed in user profil
    description?: string;
    socialLlinks?: string[];
} 


export interface SignInPayloadInterface {
    usernameOrEmail: string;
    password: string;
}

export interface ResetPasswordFormInterface{
    password: string;
    confirmPassword: string;
}

//For Api request (includes token from URL)
export interface ResetPasswordPayloadInterface  extends ResetPasswordFormInterface{
    token: string;
}


export interface PasswordInvisibility {
    password: boolean;
    confirmPassword: boolean;
}

export interface VerifyEmailInterface {
    // userID: number,
    userID: string,
    token: string
}

export interface ChangePasswordPayloadInterface {
    currentPassword: string,
    newPassword: string
}

export interface useAuthValidationInterface{
    //allow only auth related schemas
    schema: ObjectSchema<SignInPayloadInterface | SignUpPayloadInterface | ResetPasswordFormInterface>; //specific schema
    userData: SignInPayloadInterface | SignUpPayloadInterface | ResetPasswordFormInterface;
}

export interface RoleOptionInterface {
    title: string,
    description: string,
    selected: boolean,
    icon: string;
    onSelect: () => void;
}

export interface CustomerFormOptionPropsInterface {
    // userInfo: SignUpFormInterface;
    userInfo: SignUpFormUnionInterface;
    // setUserInfo: React.Dispatch<React.SetStateAction<SignUpFormInterface>>;
    setUserInfo: React.Dispatch<React.SetStateAction<SignUpFormUnionInterface>>;
    validationErrors: ValidationErrorMap; //-> Record<string,string> -> the useAuthValidation validation hook return value
    actionError: string;
}

export interface AuthUserWishlistItemInteface {
    productID: string;
    actionType: 'add' | 'remove';
}