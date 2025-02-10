import { Request, Response } from "express"
import { CustomerDocumentInterface } from "@veckovn/growvia-shared";
import { getCustomerByEmail, getCustomerByUsername, updateCustomerDataByID, updateCustomerWishlist, updateCustomerSavedFarmers, updateCustomerOrderHistory } from '@users/services/customer';


const getCustomerDetailsByUsername = async (req:Request, res:Response):Promise<void> => {
    const username = req.params.username;
    const customerData:CustomerDocumentInterface | null = await getCustomerByUsername(username);
    res.status(200).json({message: "Customer Profile Data By username", user: customerData});
}

const getCustomerDetailsByEmail = async (req:Request, res:Response):Promise<void> => {
    const email = req.params.email;
    const customerData:CustomerDocumentInterface | null = await getCustomerByEmail(email);
    res.status(200).json({message: "Customer Profile Data By email", user: customerData});
}

//PUT (updating existing)
//id from url, other data from body
const updateCustomerData = async (req:Request, res:Response):Promise<void> => {
    const customerID = req.params.customerID;
    const newData = req.body;
    const updatedData:CustomerDocumentInterface | null = await updateCustomerDataByID(customerID, newData);
    res.status(200).json({message: "Customer updated Profile", user: updatedData});
}

//POST (add new resource)
const addProductToWishlist = async (req:Request, res:Response):Promise<void> => {
    const { customerID, productID } = req.body;
    await updateCustomerWishlist(customerID, productID, "add");
    res.status(200).json({ message: "Customer wishlist increased" });
}

//DELETE
const removeProductToWishlist = async (req:Request, res:Response):Promise<void> => {
    const { customerID, productID } = req.params;
    await updateCustomerWishlist(customerID, productID, "remove");
    res.status(200).json({ message: "Customer wishlist decreased" });
}

const addFarmerToSavedList = async (req:Request, res:Response):Promise<void> => {
    const { customerID, farmerID } = req.body;
    await updateCustomerSavedFarmers(customerID, farmerID, "add");
    res.status(200).json({ message: "Customer saved list increased" });
}

//DELETE
const removeFarmerToSavedList = async (req:Request, res:Response):Promise<void> => {
    const { customerID, farmerID } = req.params;
    await updateCustomerSavedFarmers(customerID, farmerID, "remove");
    res.status(200).json({ message: "Customer wishlist decreased" });
}

const addOrderToHistory = async (req:Request, res:Response):Promise<void> => {
    const { customerID, orderID } = req.body;
    await updateCustomerOrderHistory(customerID, orderID);
    res.status(200).json({ message: "Customer History increased" });
}

export {
    getCustomerDetailsByUsername,
    getCustomerDetailsByEmail,
    updateCustomerData,
    addProductToWishlist,
    removeProductToWishlist,
    addFarmerToSavedList,
    removeFarmerToSavedList,
    addOrderToHistory
}