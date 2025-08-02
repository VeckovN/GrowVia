// import { FC, ReactElement, useState } from "react";
// import { OrderPaymentInterface, CardPaymentDataInterface } from "../../order.interface";

// //This approach validate paymentData on submitPayment here in component but.
// //i want to put validation logic in Parent (Order) component

// //CallBack function for sending collected paymentData back to Parent  
// const OrderPayment:FC<OrderPaymentInterface> = ({ onSubmitPayment}):ReactElement => {
//     const [paymentData, setPaymentData] = useState<CardPaymentDataInterface>({
//         email: '',
//         cardNumber: '',
//         date: '', //consider Date type
//         cvv: '',
//         country: '' 
//         //on payment response we should go *i think we got this dirreclty from stripe?
//         // payment_intent_id
//         // payment_method_id
//         //"payment_method": "pm_card_visa", 
//     });

//     const handleSubmitPayment = () =>{

//         //validate with zod
        
//         // if(!isValid){
//         //     //Show validation errior on UI
//         //     return;
//         // }

//         //if pass add it to onSubmitPayment
//         // onSubmitPayment(paymentData);

//         //The Order component will display alert on success/error reponse
//     }
    
//     return (
//         <div className='w-full'>

//         </div>
//     )
// }

// export default OrderPayment