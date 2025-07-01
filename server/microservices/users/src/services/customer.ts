import { CustomerDocumentInterface } from "@veckovn/growvia-shared";
import { uploadImageToCloudinary, updateImageInCloudinary } from '@users/helper';
import { CustomerModel } from "@users/models/customer";

const createCustomer = async(customerData: CustomerDocumentInterface):Promise<void> =>{
    const checkCustomerUser:CustomerDocumentInterface = await CustomerModel.findOne({username: `${customerData.username}`})
        .exec() as CustomerDocumentInterface; 

    if(!checkCustomerUser){
        const { imageUrl, imagePublicID } = await uploadImageToCloudinary(customerData.profileAvatarFile!); 
        const customerCreateData = { ...customerData, profileAvatar: { url:imageUrl, publicID:imagePublicID} };
        await CustomerModel.create(customerCreateData);
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

// const getCustomerByUserID = async(userID: string): Promise<CustomerDocumentInterface | null> =>{
//     const customerUser: CustomerDocumentInterface | null = await CustomerModel.findOne({ userID }).exec();
//     return customerUser;
// }

const updateCustomerDataByID = async(customerID: string, customerData:CustomerDocumentInterface) =>{
    // const existingCustomerData: CustomerDocumentInterface | null = await CustomerModel.findOne({ _id:customerID }).exec();
    const existingCustomerData: CustomerDocumentInterface | null = await CustomerModel.findOne({ userID:customerID }).exec();
    console.log("ExistingCUstomerDatA: ", existingCustomerData);

    if(!existingCustomerData){
        return null
    }

    let newProfileAvatar = existingCustomerData.profileAvatar ?? { url: "", publicID: "" };
    if(customerData.profileAvatarFile && customerData.profileAvatar?.publicID){
        try{
            const { imageUrl } = await updateImageInCloudinary(customerData.profileAvatarFile, customerData.profileAvatar.publicID);
            newProfileAvatar = {
                url: imageUrl,
                publicID: newProfileAvatar.publicID 
            }
        }
        catch(error){
            newProfileAvatar = existingCustomerData?.profileAvatar || newProfileAvatar;
        }
    }

    //CHANGE THIS  to 'userID' prop
    //to update and return newUpdated document -> findOnAndUpdate
    const updatedUser = CustomerModel.findOneAndUpdate(
        { userID: customerID },
        {
            $set: {
                username: customerData.username, 
                email: customerData.email, 
                fullName: customerData.fullName, 
                location: customerData.location, 
                // profilePicture: newProfilePicture,
                // profileImage: newProfileImage,
                profileAvatar: newProfileAvatar,
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
        { userID: customerID },
        action === 'add'
            ? { $addToSet: {wishlist: productID}}
            : { $pull: { wishlist: productID}}
    ).exec();
}

const updateCustomerSavedFarmers = async(customerID: string, farmerID: string, action: 'add' | 'remove'):Promise<void> =>{
    await CustomerModel.updateOne(
        { userID: customerID },
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
        { userID: customerID },
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





// So that means i should have for all farmers' images?
// xport interface FarmerDocumentInterface {
//     userID?: string;
//     username?: string;
//     email?: string;

//     profilePicture?: string;
//     profilePublicID?: string;

//     profileAvatar?: {
//         url: string,
//         publicID: string,
//     };
//     backgroundImage?: {
//         url: string,
//         publicID: string,
//     };
//     profileImages?: [
//         {
//             url: string,
//             publicID: string,
//         }
//     ];