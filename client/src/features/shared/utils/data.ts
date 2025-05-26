import fruit from '../../../assets/categories/fruit.svg';
import vegetables from '../../../assets/categories/vegetables.svg';

// import strawberries from '../../../assets/products/strawberries.jpg';
// import carrot from '../../../assets/products/strawberries.jpg';

export interface productCategoriesInterface {
    id: string | number,
    name: string,
    icon: string
}

export const productCategories: productCategoriesInterface[] = [
// export const productCategories = [
    {
        id: '1',
        name: "Fruit",
        icon: fruit,
    },
    {
        id: '2',
        name: "Vegetables",
        icon: vegetables,
    },
    // {
    //     id: '3',
    //     name: "Dairy Products",
    //     icon: fruit,
    // },
    // {
    //     id: '4',
    //     name: "Grains",
    //     icon: fruit,
    // },
    // {
    //     id: '5',
    //     name: "Artisan Goods",
    //     icon: fruit,
    // },
    // {
    //     id: '6',
    //     name: "Eggs",
    //     icon: fruit,
    // },
    // {
    //     id: '7',
    //     name: "Herbs&Plants",
    //     icon: fruit,
    // }
]
