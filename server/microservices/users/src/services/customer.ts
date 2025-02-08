import { CustomerDocumentInterface } from "@veckovn/growvia-shared";
import { CustomerModel } from "@users/models/customer";


const createCustomer = async(customerData: CustomerDocumentInterface):Promise<void> =>{
    // //check does user exists
    const checkCustomerUser:CustomerDocumentInterface = await CustomerModel.findOne({username: `${customerData.username}`})
        .exec() as CustomerDocumentInterface; 
    if(!checkCustomerUser){
        await CustomerModel.create(customerData);
    }
}

export { 
    createCustomer
}