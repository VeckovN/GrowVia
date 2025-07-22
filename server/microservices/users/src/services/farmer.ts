import { FarmerDocumentInterface, UserProductUpdatePropInterface } from "@veckovn/growvia-shared";
import { FarmerModel } from "@users/models/farmer";
import { uploadImageToCloudinary } from "@users/helper";
import { publishMessage } from "@users/rabbitmqQueues/producer";
import { userChannel } from "@users/server";

const createFarmer = async(farmerData: FarmerDocumentInterface):Promise<void> =>{
    const checkCustomerUser:FarmerDocumentInterface = await FarmerModel.findOne({username: `${farmerData.username}`})
        .exec() as FarmerDocumentInterface; 
    if(!checkCustomerUser){

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

const getFarmerByID = async(ID: string): Promise<FarmerDocumentInterface | null> =>{
    const farmerUser: FarmerDocumentInterface | null = await FarmerModel.findOne({ userID:ID }).exec();
    return farmerUser;
}

const getFarmerByUsername = async(username: string): Promise<FarmerDocumentInterface | null> =>{
    const farmerUser: FarmerDocumentInterface | null = await FarmerModel.findOne({ username }).exec();
    return farmerUser;
}

const getFarmerByEmail = async(email: string): Promise<FarmerDocumentInterface | null> =>{
    const farmerUser: FarmerDocumentInterface | null = await FarmerModel.findOne({ email }).exec();
    return farmerUser;
}

const getNewest = async(limit: number = 10): Promise<FarmerDocumentInterface[]> =>{
    const newestFarmers: FarmerDocumentInterface[] = await FarmerModel
        .find()
        .sort({ createdAt: -1 }) // newest first
        .limit(limit)
        .exec();
    return newestFarmers;
}

const updateFarmerDataByID = async(farmerID: string, farmerData:FarmerDocumentInterface) =>{
    //BUG WITH UPDATING OBJECT WITH "$SET" 

    //set opratro make problem for updating not full object -> 
    //for example if i pass location: "address" it replace whole location obj with ony that prop
    //won't be override and all other location props will be lost
    
    const updatedUser = FarmerModel.findOneAndUpdate(
        { userID: farmerID },
        {
            $set: {
                username: farmerData.username, 
                email: farmerData.email, 
                fullName: farmerData.fullName, 
                farmName: farmerData.farmName, 
                phoneNumber: farmerData.phoneNumber,
                //for example if we pass location.addres it will only store 'address' as prop and remove all other notchanged props
                location: farmerData.location, //This will overwrites entire object (not only passed props)
                description: farmerData.description,
                profileAvatar: farmerData.profileAvatar,
                backgroundImage: farmerData.backgroundImage,
                socialLinks: farmerData.socialLinks
            }
        },
        { new: true }
    );

    if (!updatedUser) return null; 
    
    let userProductData:UserProductUpdatePropInterface = {}
    if(farmerData.farmName)
        userProductData.farmName = farmerData.farmName;

    if(farmerData.location){
        userProductData.farmerLocation = {
            country: farmerData.location.country,
            city: farmerData.location.city,
            address: farmerData.location.address,
        }
    }
    
    if(Object.keys(userProductData).length > 0){
        userProductData.farmerID = farmerID

        //notify Product Service if 'farmName','location' changed
        await publishMessage(
            userChannel,
            'user-update-profile-product',
            'user-update-profile-product-key',
            'User update profile product data sent to the Product Service',
            JSON.stringify({data: userProductData})
        );
    }

    return updatedUser;
}

export {
    createFarmer,
    getFarmerByID,
    getFarmerByUsername,
    getFarmerByEmail,
    getNewest,
    updateFarmerDataByID,
}