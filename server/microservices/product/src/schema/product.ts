import { UNIT_TYPES } from '@veckovn/growvia-shared';
import { z } from 'zod';

//Using zod Validation Schema as pre-validation Before Hitting The DB
const ProductCreateZodSchema = z.object({
    farmerID: z.string().min(1, "Farmer ID is required"),
    farmName: z.string().min(2, "Farm name is required"),
    farmerLocation: z.object({
        country: z.string().min(2, "Country is required").optional(),
        city: z.string().min(2, "City is required").optional(),
        address: z.string().min(5, "Address is required").optional(),
    }),
    name: z.string().min(3, "Product name must be at least 3 characters"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    shortDescription: z.string().min(5, "Short description must be at least 5 characters"),
    category: z.string().min(1, "Category is required"),
    subCategories: z.array(z.string()).optional(),
    price: z.number().min(0, "Price must be non-negative"),
    stock: z.number().min(0, "Stock must be a positive number"),
    unit: z.enum(UNIT_TYPES),
    tags: z.array(z.string()).optional(),
});

//schema for updating a product (partial -> all fields are optional)
const ProductUpdateZodSchema = ProductCreateZodSchema.partial();

export { ProductCreateZodSchema, ProductUpdateZodSchema }