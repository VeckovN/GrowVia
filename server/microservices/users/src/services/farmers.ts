import { FarmerDocumentInterface } from "@veckovn/growvia-shared";
import { FarmerModel } from "@users/models/farmer";

const createFarmer = async(farmerData: FarmerDocumentInterface):Promise<void> =>{
    const checkCustomerUser:FarmerDocumentInterface = await FarmerModel.findOne({username: `${farmerData.username}`})
        .exec() as FarmerDocumentInterface; 
    if(!checkCustomerUser){
        await FarmerModel.create(farmerData);
    }
}

const getFarmerByUsername = async(username: string): Promise<FarmerDocumentInterface | null> =>{
    const farmerUser: FarmerDocumentInterface | null = await FarmerModel.findOne({ username }).exec();
    return farmerUser;
}

const getFarmerByEmail = async(email: string): Promise<FarmerDocumentInterface | null> =>{
    const farmerUser: FarmerDocumentInterface | null = await FarmerModel.findOne({ email }).exec();
    return farmerUser;
}

const updateFarmerDataByID = async(farmerID: string, farmerData:FarmerDocumentInterface) =>{
    const updatedUser = FarmerModel.findOneAndUpdate(
        { _id: farmerID },
        {
            $set: {
                username: farmerData.username, 
                email: farmerData.email, 
                fullName: farmerData.fullName, 
                farmName: farmerData.farmName, 
                location: farmerData.location, 
                profilePicture: farmerData.profilePicture,
            }
        },
        { new: true }
    );
    return updatedUser;
}


export {
    createFarmer,
    getFarmerByUsername,
    getFarmerByEmail,
    updateFarmerDataByID,
}