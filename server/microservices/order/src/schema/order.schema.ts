import { z } from 'zod';

// Order Creation Schema
const OrderCreateZodSchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
    farmer_id: z.string().min(1, "Farmer ID is required"),
    total_amount: z.number().min(0, "Total amount must be non-negative"),
    payment_status: z.string().min(1, "Payment status is required"),
    order_status: z.string().default('Pending Farmer Approval'),
    payment_intent_id: z.string().optional(),
    payment_token: z.string().optional(),
    shipping_address: z.string().optional(),
    billing_address: z.string().optional(),
    delivery_date: z.string().optional(),
    tracking_url: z.string().optional(),
    payment_method: z.string().optional(),
})

// Order Update Schema (optional fields)
const OrderUpdateZodSchema = OrderCreateZodSchema.partial();

// Order Item Creation Schema
const OrderItemCreateZodSchema = z.object({
    order_id: z.string().uuid("Invalid order ID").min(1, "Order ID is required"),
    product_id: z.string().min(1, "Product ID is required"),
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