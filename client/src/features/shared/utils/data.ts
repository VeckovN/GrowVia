import fruit from '../../../assets/categories/fruit.svg';
import vegetables from '../../../assets/categories/vegetables.svg';

import strawberriesImg from '../../../assets/products/strawberries.jpg';
// import strawberriesImg2 from 'src/assets/products/strawberries.jpg';
import carrotImg from '../../../assets/products/carrot.jpg';
import honeyImg from '../../../assets/products/honey.jpg';
import whiteBeansImg from '../../../assets/products/whiteBeans.jpg';

import background1 from '../../../assets/farmers/bg1.jpg';
import avatar1 from '../../../assets/farmers/avatar1.jpg';
import background2 from '../../../assets/farmers/bg2.jpg';
import avatar2 from '../../../assets/farmers/avatar2.jpg';

import { SignUpFormInterface } from '../../auth/auth.interfaces';

export interface productCategoriesInterface {
    id: string | number,
    name: string,
    icon: string
}

export interface SlideListInterface {
    title:string
}

//from growvia-shared library(used in backend microservices)
export const UNIT_TYPES = ["piece", "kg", "g", "liter", "ml"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export interface ProductItemInterface {
    id:string,
    name:string,
    category:string,
    unit: UnitType;
    farmerName:string,
    farmerLocation:string,
    price:number,
    favorite:boolean, 
    image:string,
    addFavorite(productID: string):void
}

// interface ProductViewInterface{
// }


export interface FarmerItemInterface {
    id: string,
    name:string,
    location:string,
    avatar: string,
    background: string
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
        name: "Herbs&Plants",
        icon: fruit,
    }
]


//mock data:

export const productsList: ProductItemInterface[] = [
    {
        id:'a1',
        name:"Strawberries",
        category:"Fruit",
        unit:"kg",
        farmerName:"Green Fields Co-op",
        farmerLocation:" Dane County, Wisconsin",
        price:11.9,
        favorite:false, 
        image:strawberriesImg
    },
    {
        id:'a2',
        name:"Carrot",
        category:"Vegetable",
        unit:"kg",
        farmerName:"Green Fields Co-op",
        farmerLocation:"DeForest, Dane County, Wisconsin",
        price:2.99,
        favorite:true, 
        image:carrotImg
    },
    {
        id:'a3',
        name:"White Beans",
        category:"Vegetable",
        unit:"kg",
        farmerName:"Green Fields Co-op",
        farmerLocation:"DeForest, Dane County, Wisconsin",
        price:5.99,
        favorite:false, 
        image:whiteBeansImg
    },
    {
        id:'a4',
        name:"Honey",
        category:"Artisan Goods",
        unit:"piece",
        farmerName:"Sunny Farmstead",
        farmerLocation:"Candler, Buncombe County, North Carolina",
        price:5.99,
        favorite:false,  
        image:honeyImg
    }
]


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
    profilePicture: '',
    fullName: '', //FistName + LastName
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