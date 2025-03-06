import { z } from 'zod';

const UNIT_TYPES = ["piece", "kg", "g", "liter", "ml"] as const;

//Using zod Validation Schema as pre-validation Before Hitting The DB
const ProductCreateZodSchema = z.object({
    farmerID: z.string().min(1, "Farmer ID is required"),
    name: z.string().min(3, "Product name must be at least 3 characters"),
    images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
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