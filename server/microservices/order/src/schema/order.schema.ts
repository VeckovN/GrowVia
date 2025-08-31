import { z } from 'zod';

// Order Creation Schema
const OrderCreateZodSchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
    farmer_id: z.string().min(1, "Farmer ID is required"),
    // total_amount: z.number().min(0, "Total amount must be non-negative"),
    customer_email: z.string().min(1, "Customer Email is required").email("Invalid email format"),
    customer_username: z.string()
        .min(3, "Customer Username too short")
        .max(30, "Customer Username to long")
        .regex(
            /^[a-zA-Z][a-zA-Z0-9_]*$/,
            "Username must start with a letter and can only contain letters, numbers, and underscores"
        ),
    customer_first_name: z.string().max(50, "First name too long").optional(),
    customer_last_name: z.string().max(50, "Last name too long").optional(),
    customer_phone: z.string().max(20, "Phone number too long").optional(),
    farmer_email: z.string().min(1, "Farmer Email is required").email("Invalid email format"),
    farmer_username: z.string()
        .min(3, "Farmer Username too short")
        .max(30, "Farmer Username to long")
        .regex(
            /^[a-zA-Z][a-zA-Z0-9_]*$/,
            "Username must start with a letter and can only contain letters, numbers, and underscores"
    ),
    farm_name: z.string()
        .min(1, "Farm name is required")
        .max(100, "Farm name too long"),
    invoice_id: z.string().min(1, "Order Invoice iD is required").max(50, "Invoice ID too long"),
    total_price: z.number().min(0.01, "Amount must be at least 0.01").max(100000, "Amount too large"),
    order_status: z.enum([
        'pending',
        'accepted',
        'canceled',
        'processing',
        'shipped',
        'completed'
    ]).default('pending'),
    payment_status: z.enum([
        'pending',
        'authorized',
        'paid',
        'refunded',
        'canceled'
    ]).optional(), //Only for stipe payment process
    payment_type: z.enum(['stripe', 'cod']),
    payment_method: z.string().optional(), //relaeted to stripe
    payment_intent_id: z.string().optional(),
    payment_method_id: z.string().optional(),
    // payment_expires_at: z.date().optional(), 
    payment_expires_at: z.string().optional(), 
    shipping_address: z.string().max(100, "Address too long").optional(),
    shipping_postal_code: z.string().max(20, "Postal code too long").optional(),
    billing_address: z.string().max(100, "Address too long").optional(),
    delivery_date: z.string().optional(),
    tracking_url: z.string().optional(),

})


// Order Update Schema (optional fields)
const OrderUpdateZodSchema = OrderCreateZodSchema.partial();

// Order Item Creation Schema
const OrderItemCreateZodSchema = z.object({
    order_id: z.string().uuid("Invalid order ID").min(1, "Order ID is required"),
    product_id: z.string().min(1, "Product ID is required"),
    product_name: z.string().min(1, "Product name is required"),
    product_image_url: z.string().url("Invalid product image URL"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unit_price: z.number().min(0, "Unit price must be non-negative"),
    total_price: z.number().min(0, "Total price must be non-negative"),
});

  // Order Item Update Schema (optional fields)
const OrderItemUpdateZodSchema = OrderItemCreateZodSchema.partial();

// Combined Order and Order Items Schema
const OrderWithItemsCreateZodSchema = z.object({
    order: OrderCreateZodSchema,
    order_items: z.array(OrderItemCreateZodSchema),
});

// const OrderWithItemsUpdateZodSchema = z.object({
//     order: OrderUpdateZodSchema,
//     order_items: z.array(OrderItemUpdateZodSchema),
// });


export {
    OrderCreateZodSchema,
    OrderUpdateZodSchema,
    OrderItemCreateZodSchema,
    OrderItemUpdateZodSchema,
    OrderWithItemsCreateZodSchema
}