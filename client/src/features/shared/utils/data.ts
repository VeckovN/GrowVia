import fruit from '../../../assets/categories/fruit.svg';
import vegetables from '../../../assets/categories/vegetables.svg';

import background1 from '../../../assets/farmers/bg1.jpg';
import avatar1 from '../../../assets/farmers/avatar1.jpg';
import background2 from '../../../assets/farmers/bg2.jpg';
import avatar2 from '../../../assets/farmers/avatar2.jpg';

import gallery1 from '../../../assets/farmers/gallery/Card1.jpg';
import gallery2 from '../../../assets/farmers/gallery/Card2.jpg';
import gallery3 from '../../../assets/farmers/gallery/Card3.jpg';
import gallery4 from '../../../assets/farmers/gallery/Card4.jpg';
import gallery5 from '../../../assets/farmers/gallery/Card5.jpg';
import gallery6 from '../../../assets/farmers/gallery/Card6.jpg';

import { SignUpFormInterface } from '../../auth/auth.interfaces';
import { GalleryImageInterface } from '../../farmer/farmer.interface';

export interface productCategoriesInterface {
    id: string | number,
    name: string,
    icon: string
}


//from growvia-shared library(used in backend microservices)
export const UNIT_TYPES = ["piece", "kg", "g", "liter", "ml"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];


export const DEFAULT_IMAGE: {url:string, publicID:string} = {
    url: avatar1,
    publicID: ''
}

export const productCategories: productCategoriesInterface[] = [
// export const productCategories = [
    {
        id: 'f1',
        name: "Fruit",
        icon: fruit,
    },
    {
        id: 'v2',
        name: "Vegetables",
        icon: vegetables,
    },
    {
        id: 'pd3',
        name: "Dairy Products",
        icon: fruit,
    },
    {
        id: 'g4',
        name: "Grains",
        icon: fruit,
    },
    {
        id: 'ag5',
        name: "Artisan Goods",
        icon: fruit,
    },
    {
        id: 'e6',
        name: "Eggs",
        icon: fruit,
    },
    {
        id: 'hb7',
        // name: "Herbs&Plants",
        name: "HerbsAndPlants",
        icon: fruit,
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
    // profilePicture: '',

    profileAvatarFile: '',
    backgroundImageFile: '',

    // profileAvatar: {
    //     url:'',
    //     publicID:'',
    // },
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

export const farmerGalleryImages:GalleryImageInterface[] = [
    { url: gallery1 , publicID: ''},
    { url: gallery2 , publicID: ''},
    { url: gallery3 , publicID: ''},
    { url: gallery4 , publicID: ''},
    { url: gallery5 , publicID: ''},
    { url: gallery6 , publicID: ''}
]