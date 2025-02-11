import { CustomerDocumentInterface } from "@veckovn/growvia-shared";
import { CustomerModel } from "@users/models/customer";

const createCustomer = async(customerData: CustomerDocumentInterface):Promise<void> =>{
    const checkCustomerUser:CustomerDocumentInterface = await CustomerModel.findOne({username: `${customerData.username}`})
        .exec() as CustomerDocumentInterface; 
    if(!checkCustomerUser){
        await CustomerModel.create(customerData);
    }
}

const getCustomerByUsername = async(username: string): Promise<CustomerDocumentInterface | null> =>{
    const customerUser: CustomerDocumentInterface | null = await CustomerModel.findOne({ username }).exec();
    return customerUser;
}

const getCustomerByEmail = async(email: string): Promise<CustomerDocumentInterface | null> =>{
    const customerUser: CustomerDocumentInterface | null = await CustomerModel.findOne({ email }).exec();
    return customerUser;
}

// if a property is not set in customerData, it will not be included in the update.
const updateCustomerDataByID = async(customerID: string, customerData:CustomerDocumentInterface) =>{
    //to update and return newUpdated document -> findOnAndUpdate
    const updatedUser = CustomerModel.findOneAndUpdate(
        { _id: customerID },
        {
            $set: {
                username: customerData.username, 
                email: customerData.email, 
                fullName: customerData.fullName, 
                location: customerData.location, 
                profilePicture: customerData.profilePicture,
                purchasedProducts: customerData.purchasedProducts,
                wishlist: customerData.wishlist, 
                savedFarmers: customerData.savedFarmes, 
                orderHistory: customerData.orderHistroy
            }
        },
        { new: true } //return new updated document
    );
    return updatedUser;
}

const updateCustomerWishlist = async(customerID: string, productID: string, action: 'add' | 'remove'):Promise<void> =>{
    await CustomerModel.updateOne(
        {_id: customerID},
        action === 'add'
            ? { $addToSet: {wishlist: productID}}
            : { $pull: { wishlist: productID}}
    ).exec();
}

const updateCustomerSavedFarmers = async(customerID: string, farmerID: string, action: 'add' | 'remove'):Promise<void> =>{
    await CustomerModel.updateOne(
        { _id: customerID },
        action === 'add'
            ? { $addToSet: { savedFarmes: farmerID } }
            : { $pull: { savedFarmes: farmerID } }
    ).exec();
}

const updateCustomerOrderHistory = async(customerID: string, orderID: string):Promise<void> => {
    //the id comes from the Order Service that uses the Postgte and the ID is stored as a UUID *THIS SHOULD BE IMPLEMENTED
    // if (!/^[0-9a-fA-F-]{36}$/.test(orderID)) {
    //     throw new Error("Invalid UUID format for order ID.");
    // }

    await CustomerModel.updateOne(
        { _id: customerID },
        { $addToSet: { orderHistory: orderID } }
    ).exec();
}
 
// const updateCustomerDataByUsername = async(username: string, customerData:CustomerDocumentInterface) =>{
// };

export { 
    createCustomer,
    getCustomerByUsername,
    getCustomerByEmail,
    updateCustomerDataByID,
    updateCustomerWishlist,
    updateCustomerSavedFarmers,
    updateCustomerOrderHistory
}