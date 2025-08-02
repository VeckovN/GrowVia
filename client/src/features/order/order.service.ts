// //Service to '/users' Service
// import { ResponseInterface } from "../shared/interfaces";
// import { api } from "../../store/api";

// export const orderApi = api.injectEndpoints({
//     endpoints: (build) => ({
//         createOrder: build.mutation<ResponseInterface, FarmerUpdateProfilePropInterface>({
//             query({}) {
//                 return {
//                     url:`/users/farmer/id`,
//                     method: 'POST',
//                     body: updateData
//                 };
//             },
//             invalidatesTags: ['Farmer']
//         }),
//     })
// })


// export const {
   
// } = orderApi;


//expected Data From REST CLIENT API Request FOR CREATE ORDER:

// "customer_id": "312",
// "customer_username": "Oralla5302",
// "customer_email": "urban.heaney38@yahoo.com",
// "farmer_id": "32",
// "farmer_username": "Meriel5733",
// "farmer_email": "tiara_keebler58@hotmail.com",
// "invoice_id": "inv123123", 
// "total_price": 149.8,
// "payment_status": "pending", //by default on makeOrder
// "order_status": "pending", // by default on makeOrder
// // 'stripe' | 'cod'  -> stripe is only if is it visa or card 
// "payment_type": "stripe", 
// "payment_intent_id": "", 
// //"payment_token": "", 
// ///use on frontend payment creation (when user request order)
// "payment_method_id": "pm_card_visa", 
// //only used for testing *in production(frontend) the 'payment_method_id' will be used
// "payment_method": "pm_card_visa",
// "shipping_address": "Mokranjceva 12", 
// //"billing_address?": "", 
// //"delivery_date?": " ", 
// "tracking_url": "tr", 

// //for Products
// "orderItems": [
//     {
//         "product_id": "22",
//         "quantity": 10,
//         "unit_price": 7.5,
//         "total_price": 75
//     },
//     {
//         "product_id": "63",
//         "quantity": 9,
//         "unit_price": 2.2,
//         "total_price": 19.8
//     },
//     {
//         "product_id": "32",
//         "quantity": 20,
//         "unit_price": 3,
//         "total_price": 60
//     }
// ]