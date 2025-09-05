import { SignUpFormInterface } from '../../auth/auth.interfaces';
import { CategoryItemPropsInterface } from '../interfaces';

import grape from '../../../assets/categories/grape.svg';
import vegetables from '../../../assets/categories/vegetables.svg';
import dairyProducts from '../../../assets/categories/cheese.svg';
import wheat from '../../../assets/categories/wheat.svg';
import jam from '../../../assets/categories/jam-jar.svg';
import eggs from '../../../assets/categories/eggs.svg';
import herbs from '../../../assets/categories/herbs.svg';

import background1 from '../../../assets/farmers/bg1.jpg';
import avatar1 from '../../../assets/farmers/avatar1.jpg';
import background2 from '../../../assets/farmers/bg2.jpg';
import avatar2 from '../../../assets/farmers/avatar2.jpg';

//from growvia-shared library(used in backend microservices)
export const UNIT_TYPES = ["piece", "kg", "g", "liter", "ml"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export const DEFAULT_IMAGE: {url:string, publicID:string} = {
    url: avatar1,
    publicID: ''
}

export const productCategories: CategoryItemPropsInterface[] = [
// export const productCategories = [
    {
        id: 'f1',
        name: "Fruit",
        icon: grape,
    },
    {
        id: 'v2',
        name: "Vegetables",
        icon: vegetables,
    },
    {
        id: 'pd3',
        name: "Dairy Products",
        icon: dairyProducts,
    },
    {
        id: 'g4',
        name: "Grains",
        icon: wheat,
    },
    {
        id: 'ag5',
        name: "Artisan Goods",
        icon: jam,
    },
    {
        id: 'e6',
        name: "Eggs",
        icon: eggs,
    },
    {
        id: 'hb7',
        // name: "Herbs&Plants",
        name: "HerbsAndPlants",
        icon: herbs,
    }
]

export const subCategories: string[] = [
    'Organic',
    'Fresh',
    'Local',
    'Seasonal',
    'Exotic',
    'Dried',
    'Juicing',
    'Frozen',
    'Flavored',
    'Vegan',
    'Sugar-Free',
    'Homemade',
    'Proceessed',
    'Medical',
    'WildCraft',
    'Rows'
]

export const categorySubcategoryMap: Record<string, string[]> = {
    Fruit: ['Organic', 'Fresh', 'Local', 'Seasonal', 'Juicing', 'Exotic', 'Vegan'],
    Vegetables: ['Organic', 'Fresh', 'Local', 'Seasonal', 'Rows'],
    DairyProducts: ['Organic', 'Fresh', 'Local', 'Seasonal', 'Flavored', 'Sugar-Free'],
    Grains: ['Organic', 'Fresh', 'Local', 'Seasonal'],
    ArtisanGoods: ['Organic', 'Fresh', 'Local', 'Seasonal','Homemade', 'Vegan', 'Sugar-Free'],
    Eggs: ['Organic', 'Fresh', 'Local'],
    HerbsAndPlants: ['Organic', 'Fresh', 'Local', 'Seasonal', 'Medical', 'WildCraft', 'Organic']
};



export const farmersList: FarmerItemInterface[] = [
    {
        id:'f1',
        name:'Green Fields Co-op',
        location:'DeForest, Dane County, Wisconsin',
        avatar:avatar1,
        background:background1
    },
    {
        id:'f2',
        name:'Sunny Farmstead',
        location:'Candler, Buncombe County, North Carolina',
        avatar:avatar2,
        background:background2
    },
    {
        id:'f3',
        name:'Harvest Roots Collective',
        location:'Junction City, Lane County, Oregon',
        avatar:avatar1,
        background:background1
    },
    {
        id:'f4',
        name:'Green Fields Co-op',
        location:'Candler, Buncombe County, North Carolina',
        avatar:avatar1,
        background:background1
    },
    {
        id:'f5',
        name:'Sunny Farmstead',
        location:'Candler, Buncombe County, North Carolina',
        avatar:avatar2,
        background:background2
    },
    {
        id:'f6',
        name:'Harvest Roots Collective',
        location:'Junction City, Lane County, Oregon',
        avatar:avatar1,
        background:background2
    },
]


export const initalSignupUserData:SignUpFormInterface = {
    username: '',
    email: '',
    password: '',
    repeatPassword:'',
    userType: 'customer',
    phoneNumber: '',
    profileAvatarFile: '',
    backgroundImageFile: '',
    // fullName: '', //FistName + LastName
    firstName: '',
    lastName: '',
    farmName: '',
    location: {
        country: 'Serbia',
        city: '',
        address: ''
    },
    description: '',
    socialLlinks: []
}

export const CITIES = [
    { value: 'Belgrade', label: 'Belgrade' },
    { value: 'Novi Sad', label: 'Novi Sad' },
    { value: 'Niš', label: 'Niš' },
    { value: 'Kragujevac', label: 'Kragujevac' },
    { value: 'Kraljevo', label: 'Kraljevo' },
];

export const SOCIAL = [
    { name: 'instagram', url:'' }, 
    { name: 'facebook', url:'' }, 
    { name: 'twitter', url:'' }, 
    { name: 'linkedin', url:'' }, 
    { name: 'tiktok', url:'' } 
]
