import {winstonLogger, uploadImage } from "@veckovn/growvia-shared";
import { Logger } from "winston";
import { config } from "@product/config";
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse } from "cloudinary";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'ProductService', 'debug');
export const uploadProductImageToCloudinary = async ( 
    imageFiles: string[]
): Promise< {url: string, publicID:string}[]> =>{
    const uploadedImages: {url: string, publicID: string}[] = [];

    if(imageFiles.length > 0)
    {
        for(const image of imageFiles) {
            try{
                const imagePublicID = uuidv4();
                const result = await uploadImage(image, imagePublicID, true, true) as UploadApiResponse;

                if(result.public_id){
                    uploadedImages.push({
                        url:result.secure_url,
                        publicID: imagePublicID
                    })
                }   
            }
            catch(error){
                log.log("error", "Product service: image didn't upload to cloudinary");   
            }
        }
    }

    return uploadedImages;
}