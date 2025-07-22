import { Request, Response } from "express"
import { FarmerDocumentInterface } from "@veckovn/growvia-shared";
import { getFarmerByID ,getFarmerByUsername, getFarmerByEmail, getNewest, updateFarmerDataByID } from "@users/services/farmer";

const getFarmerDetailsByID = async (req:Request, res:Response):Promise<void> => {
    const ID = req.params.ID;
    const farmerData:FarmerDocumentInterface | null = await getFarmerByID(ID);
    res.status(200).json({message: "Farmer Profile Data By ID", user: farmerData});
}

const getFarmerDetailsByUsername = async (req:Request, res:Response):Promise<void> => {
    const username = req.params.username;
    const farmerData:FarmerDocumentInterface | null = await getFarmerByUsername(username);
    res.status(200).json({message: "Farmer Profile Data By username", user: farmerData});
}

const getFarmerDetailsByEmail = async (req:Request, res:Response):Promise<void> => {
    const email = req.params.email;
    const farmerData:FarmerDocumentInterface | null = await getFarmerByEmail(email);
    res.status(200).json({message: "Farmer Profile Data By email", user: farmerData});
}

const getNewestFarmers = async (req:Request, res:Response):Promise<void> => {
    const limit = parseInt(req.params.limit);
    console.log("SHJA", limit);
    const farmers:FarmerDocumentInterface[] = await getNewest(limit);
    res.status(200).json({message: "Newest Farmers Data", farmers: farmers});
}

const updateFarmerData = async (req:Request, res:Response):Promise<void> => {
    const farmerID = req.params.farmerID;
    const newData = req.body;
    const updatedData:FarmerDocumentInterface | null = await updateFarmerDataByID(farmerID, newData);
    res.status(200).json({message: "Farmer updated Profile", user: updatedData});
}

export{
    getFarmerDetailsByID,
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    getNewestFarmers,
    updateFarmerData
}