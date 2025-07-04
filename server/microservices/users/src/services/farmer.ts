import { FarmerDocumentInterface } from "@veckovn/growvia-shared";
import { FarmerModel } from "@users/models/farmer";
import { uploadImageToCloudinary } from "@users/helper";


const createFarmer = async(farmerData: FarmerDocumentInterface):Promise<void> =>{
    const checkCustomerUser:FarmerDocumentInterface = await FarmerModel.findOne({username: `${farmerData.username}`})
        .exec() as FarmerDocumentInterface; 
    if(!checkCustomerUser){
        //we got two images to upload
        //profileAvatarFile
        //backgroundImageFile
        
        const [profileUpload, backgroundUpload] = await Promise.all([
            uploadImageToCloudinary(farmerData.profileAvatarFile!),
            uploadImageToCloudinary(farmerData.backgroundImageFile!)
        ])

        const farmerCreateData = { 
            ...farmerData, 
            profileAvatar:{ url: profileUpload.imageUrl, publicID:profileUpload.imagePublicID },
            backgroundImage:{ url: backgroundUpload.imageUrl, publicID:backgroundUpload.imagePublicID },
         };
        
        await FarmerModel.create(farmerCreateData);
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
        { userID: farmerID },
        {
            $set: {
                username: farmerData.username, 
                email: farmerData.email, 
                fullName: farmerData.fullName, 
                farmName: farmerData.farmName, 
                phoneNumber: farmerData.phoneNumber,
                location: farmerData.location, 
                description: farmerData.description,
                profileAvatar: farmerData.profileAvatar,
                backgroundImage: farmerData.backgroundImage,
                socialLinks: farmerData.socialLinks
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