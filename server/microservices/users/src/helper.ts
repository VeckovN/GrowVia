// import {winstonLogger, uploadImage, CustomerDocumentInterface, FarmerDocumentInterface } from "@veckovn/growvia-shared";
import {winstonLogger, uploadImage, deleteImage } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from "@users/config";
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse } from "cloudinary";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'userService', 'debug');
//enter customer imageFile instead of whole customerData object
export const uploadImageToCloudinary = async ( 
    imageFile: string
): Promise<{ imageUrl: string, imagePublicID: string }> =>{
    let imageUrl = "";
    let imagePublicID = "";

    if(imageFile)
    {
        try{
            imagePublicID = uuidv4();
            // const result = await uploadImage(userData.profileImageFile, imagePublicID, true, true) as UploadApiResponse;
            const result = await uploadImage(imageFile, imagePublicID, true, true) as UploadApiResponse;
            
            if(result.public_id){
                console.log("result.public_id")
                imageUrl = result?.secure_url;
                log.info("User service: Image successfully uploaded to cloudinary");
            } else{
                console.log("FAILED result.public_id")
                imagePublicID = "";
            }
        }
        catch(err){
            //on error imagePublicID and profilePicture will be ""
            imagePublicID = "";
            log.log("error", "User service: image didn't upload to cloudinary");   
        }
    }

    return { 
        imageUrl,
        imagePublicID 
    } 
}

export const updateImageInCloudinary = async (
    newProfilePictureFile: string,
    existingPublicID: string // The current `public_id` to overwrite
): Promise<{ imageUrl: string }> => {
        let imagePublicID = existingPublicID;
        let imageUrl = "";
        try{
            // invalidate = true (purge CDN cache), overwrite = true (replace existing image)
            // const result = await uploadImage(newProfilePicture, imagePublicID, true, true) as UploadApiResponse;
            const result = await uploadImage(newProfilePictureFile, imagePublicID, true, true) as UploadApiResponse;
            
            if(result.public_id){
                // profilePicture = result?.secure_url;
                imageUrl = result?.secure_url;
                log.info("User service: Image successfully uploaded to cloudinary");
            } 
        }
        catch(err){
            log.log("error", "User service: image didn't upload to cloudinary");   
        }

    return { 
        // profilePicture 
        imageUrl 
    } 
}

export const deleteImageFromCloudinary = async (
    publicID: string
): Promise<boolean> => {
    if(!publicID) return false;

    try{
        const removeResult = await deleteImage(publicID, true)

        console.log("RemoveResult: ", removeResult);

        if(removeResult?.result === 'ok'){
            log.info(`User service: Image with publicID:${publicID} deleted from cloudinary`);
            return true;
        }
        else {
            log.warn(`User service: Failed to delete image ${publicID} (status: ${removeResult?.result})`);
            return false;
        }

    } catch (err) {
        log.log("error", `User service: error deleting image ${publicID} from cloudinary`);   
        return false;
    }
}