import { FarmerDocumentInterface, UserProductUpdatePropInterface } from "@veckovn/growvia-shared";
import { FarmerModel } from "@users/models/farmer";
import { uploadImageToCloudinary, updateImageInCloudinary, deleteImageFromCloudinary } from "@users/helper";
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

const searchFarmers = async(
    from: number, 
    size:number, 
    farmerQuery:string
// ): Promise<FarmerDocumentInterface[]> =>{
): Promise<{farmers:FarmerDocumentInterface[], total:number}> =>{
    const query: any = {}

    if(farmerQuery || farmerQuery.trim() !==""){
        query.farmName = { $regex: `^${farmerQuery.trim()}`, $options: "i" };
    }

    const [farmers, total] = await Promise.all([
        FarmerModel.find(query)
        .skip(from || 0)
        .limit(size || 12)
        .sort({ createdAt: -1 })
        .exec(),

        FarmerModel.countDocuments(query)
    ])

    return {farmers, total};
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
    const existingUser = await FarmerModel.findOne({ userID: farmerID})
    if(!existingUser) return null;

    //existing profile images
    let updatedProfileImages: {url: string, publicID: string}[] = existingUser.profileImages || [];

    const updateFields: any = {
        username: farmerData.username, 
        email: farmerData.email, 
        fullName: farmerData.fullName, 
        farmName: farmerData.farmName, 
        phoneNumber: farmerData.phoneNumber,
        // location: farmerData.location, //This will overwrites entire object (not only passed props)
        description: farmerData.description,
        profileAvatar: farmerData.profileAvatar,
        backgroundImage: farmerData.backgroundImage,
        socialLinks: farmerData.socialLinks
    }

    if(farmerData.profileAvatarFile){
        const existingPublicID = existingUser.profileAvatar?.publicID ?? "";
        const { imageUrl } = await updateImageInCloudinary(farmerData.profileAvatarFile, existingPublicID)
        if(imageUrl) {
            updateFields["profileAvatar"] = {
                url: imageUrl,
                publicID: existingPublicID || undefined
            }
        }
    }

    if(farmerData.backgroundImageFile){
        const existingPublicID = existingUser.backgroundImage?.publicID ?? "";
        const { imageUrl } = await updateImageInCloudinary(farmerData.backgroundImageFile, existingPublicID)
        if(imageUrl) {
            updateFields["backgroundImage"] = {
                url: imageUrl,
                publicID: existingPublicID || undefined
            }
        }
    }
    
    if (farmerData.profileImagesFile?.length) {
        for (const file of farmerData.profileImagesFile) {
            const { imageUrl, imagePublicID } = await uploadImageToCloudinary(file);
            if(imageUrl) {
                const newImage = { url: imageUrl, publicID: imagePublicID }
                const exists = updatedProfileImages.some(
                    (img) => img.publicID === newImage.publicID
                )

                if(!exists){
                    updatedProfileImages.push(newImage);
                }
            }
       }
       updateFields["profileImages"] = updatedProfileImages;
    }

    //delete images passed as publicID in removedImages array
    if(Array.isArray(farmerData.removedImages) && farmerData.removedImages?.length > 0){
        for (const imgPublicID of farmerData.removedImages) {
            const isDeleted = await deleteImageFromCloudinary(imgPublicID);
            
            if(isDeleted){
                updatedProfileImages = updatedProfileImages?.filter(img => img.publicID !== imgPublicID)
            }
        }
        updateFields["profileImages"] = updatedProfileImages;
    } 

    if (farmerData.location?.country) {
        updateFields["location.country"] = farmerData.location.country;
    }
    if (farmerData.location?.city) {
        updateFields["location.city"] = farmerData.location.city;
    }
    if (farmerData.location?.address) {
        updateFields["location.address"] = farmerData.location.address;
    }

    if (farmerData.location?.latitude) {
        updateFields["location.latitude"] = farmerData.location.latitude;
    }

    if (farmerData.location?.longitude) {
        updateFields["location.longitude"] = farmerData.location.longitude;
    }
    
    const updatedUser = FarmerModel.findOneAndUpdate(
        { userID: farmerID },
        { $set: updateFields },
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
    searchFarmers,
    getNewest,
    updateFarmerDataByID,
}