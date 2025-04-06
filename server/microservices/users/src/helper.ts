import {winstonLogger, uploadImage, CustomerDocumentInterface, FarmerDocumentInterface } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from "@users/config";
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse } from "cloudinary";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'userService', 'debug');
export const uploadImageToCloudinary = async ( 
    userData: CustomerDocumentInterface | FarmerDocumentInterface 
): Promise<{ profilePublicID: string, profilePicture: string }> =>{
    let profilePublicID = "";
    let profilePicture = "";

    if(userData.profilePicture)
    {
        try{
            profilePublicID = uuidv4();
            const result = await uploadImage(userData.profilePicture, profilePublicID, true, true) as UploadApiResponse;
            
            if(result.public_id){
                profilePicture = result?.secure_url;
                log.info("User service: Image successfully uploaded to cloudinary");
            } else{
                profilePublicID = "";
            }
        }
        catch(err){
            //on error profilePublicID and profilePicture will be ""
            profilePublicID = "";
            log.log("error", "User service: image didn't upload to cloudinary");   
        }
    }

    return { 
        profilePublicID,
        profilePicture 
    } 
}

export const updateImageInCloudinary = async (
    newProfilePicture: string,
    existingPublicID: string // The current `public_id` to overwrite
  ): Promise<{ profilePicture: string }> => {
        let profilePublicID = existingPublicID;
        let profilePicture = "";

        try{
            // invalidate = true (purge CDN cache), overwrite = true (replace existing image)
            const result = await uploadImage(newProfilePicture, profilePublicID, true, true) as UploadApiResponse;
            
            if(result.public_id){
                profilePicture = result?.secure_url;
                log.info("User service: Image successfully uploaded to cloudinary");
            } 
        }
        catch(err){
            log.log("error", "User service: image didn't upload to cloudinary");   
        }

    return { 
        profilePicture 
    } 
}