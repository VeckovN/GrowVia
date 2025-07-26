import { ObjectSchema, object, string, array, number, mixed } from 'yup';
import { CreateProductInterface } from './product.interface';
import { UNIT_TYPES, UnitType } from "../shared/utils/data";

const startsWithCapital = {
    name: 'starts-with-capital',
    message: 'Must start with a capital letter',
    test: (value: string | undefined) => {
        if (!value) return true; // Let required handle empty values
        return /^[A-Z]/.test(value);
    }
};

const productSchema: ObjectSchema<CreateProductInterface> = object({
    farmerID: string()
        .required('Farmer ID is required'),

    farmName: string().optional(),
    
    farmerLocation: object({
        country: string().optional(),
        city: string().optional(),
        address: string().optional()
    }).optional(),

    farmerAvatar: object({
        url: string().optional(),
        publicID: string().optional()
    }).optional(),

    name: string()
        .required('Product name is required')
        .min(3, 'Product name must be at least 3 characters')
        .test(startsWithCapital),

    images: array(
        string()
        // .url('Invalid image URL')
        .required('Image URL is required')
    )
    .required('At least one image is required')
    .min(1, 'At least one image is required'),

    description: string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .test(startsWithCapital),

    shortDescription: string()
        .required('Short description is required')
        .min(5, 'Short description must be at least 10 characters')
        .test(startsWithCapital),

    category: string()
        .required('Category is required'),

    subCategories: array(
        string()
        .required('Subcategory is required')
    )
    .required('At least one subcategory is required')
    .min(1, 'At least one subcategory is required'),

    price: number()
        .required('Price is required')
        .min(0, 'Price must be non-negative'),

    stock: number()
        .required('Stock is required')
        .min(0, 'Stock must be a positive number'),

    unit: string()
        .oneOf([...UNIT_TYPES] as const)
        .required('Unit is required'),

    tags: array(
        string()
        .required('Tag is required')
    )
    .optional()
    .default([])
}) 

export { productSchema };