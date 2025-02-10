import { Request, Response } from "express"
import { FarmerDocumentInterface } from "@veckovn/growvia-shared";
import { getFarmerByUsername, getFarmerByEmail, updateFarmerDataByID } from "@users/services/farmers";

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


const updateFarmerData = async (req:Request, res:Response):Promise<void> => {
    const farmerID = req.params.farmerID;
    const newData = req.body;
    const updatedData:FarmerDocumentInterface | null = await updateFarmerDataByID(farmerID, newData);
    res.status(200).json({message: "Farmer updated Profile", user: updatedData});
}


export{
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail,
    updateFarmerData
}