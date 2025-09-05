import { useState } from "react";
import { useAppDispatch } from '../../store/store';
import toast from 'react-hot-toast';

import { useUpdateFarmerMutation } from "../farmer/farmer.service";
import { useSchemaValidation } from "../shared/hooks/useSchemaValidation";

import { farmerProfileSchema } from '../farmer/farmer.schema';
import { SOCIAL } from "../shared/utils/data";
import { mapFarmerToAuthUser } from "../shared/utils/utilsFunctions";
import { updateAuthUser } from "../auth/auth.reducers";

import { FarmerProfileInterface, FarmerDocumentInterface} from "../farmer/farmer.interface";
import { AuthUserInterface, FarmerLocationInterface } from "../auth/auth.interfaces";

const useFarmerProfile = (authUser: AuthUserInterface) => {
    const dispatch = useAppDispatch();

    const [ updateFarmer, { isLoading:uploadLoading } ] = useUpdateFarmerMutation();
    
    const [userData, setUserData] = useState<FarmerProfileInterface>({
        farmName: authUser.farmName,
        firstName: authUser.fullName.split(' ')[0],
        lastName: authUser.fullName.split(' ')[1],
        phoneNumber: authUser.phoneNumber,
        location: {
            longitude:'',
            latitude:'',
            country:authUser.location.country,
            city:authUser.location.city,
            address:authUser.location.address,
        }, 
        profileAvatarFile: '',
        backgroundImageFile: '', 
        profileImagesFile: [],
        description: authUser.description, 

        //from backend we got socialLinks as string array
        socialLinks: SOCIAL.map((el) => {
            const existingUrl = authUser.socialLinks?.find((url: string) =>
                url.toLowerCase().includes(el.name.toLowerCase())
            );

            return {
                name: el.name,
                url: existingUrl || '',
            };
        }),
    });

    const [schemaValidation, validationErrors, resetValidationErrors] = useSchemaValidation({
        schema: farmerProfileSchema, 
        userData
    });

    const getChangedFields = (original: any, updated: any) => {
        const changes: any = {};

        const { firstName, lastName, ...updatedData } = updated;

        const mergedData = {
            ...updatedData,
            fullName: `${firstName} ${lastName}`
        };

        for (const key in mergedData) {

            if (key === 'location') {
                const locationChanges: any = {};
                const updatedLocation = mergedData.location || {};
                const originalLocation = original?.location || {};

                for (const locKey in updatedLocation) {
                    // Only include if field exists in original OR the updated value is not empty
                    const updatedVal = updatedLocation[locKey];
                    const originalVal = originalLocation[locKey];

                    if ( updatedVal !== originalVal && (originalVal !== undefined || updatedVal !== '')) {
                        locationChanges[locKey] = updatedVal;
                    }
                }

                if (Object.keys(locationChanges).length > 0) {
                    changes.location = locationChanges;
                }
            }

            else if (key === 'socialLinks') {
                const originalLinks = original[key] || [];
                const updatedLinks = mergedData[key] || [];

                const bothEmpty = originalLinks.length === 0 && updatedLinks.length === 0;

                if (!bothEmpty && JSON.stringify(originalLinks) !== JSON.stringify(updatedLinks)) {
                    changes[key] = updatedLinks;
                }
            }

            else if (key === 'profileAvatarFile' || key === 'backgroundImageFile') {
                // Only include if actually set
                if (mergedData[key] && mergedData[key] !== '') {
                    changes[key] = mergedData[key];
                }
            }

            else if (key === 'profileImagesFile' || key === 'removedImages') {
                if (Array.isArray(mergedData[key]) && mergedData[key].length > 0) {
                    changes[key] = mergedData[key];
                }
            }

            else {
                if (mergedData[key] !== original?.[key]) {
                    changes[key] = mergedData[key];
                }
            }
        }
        return changes;
    };

    const handleSubmit = async(additionalData = {}):Promise<FarmerDocumentInterface> =>{
        const isValid = await schemaValidation(); 

        if(!isValid){
            toast.error("Validation Field error"); //think to call toast.error in caller component
            throw new Error("Validation failed");
        }

        //transform socialLinks objects to string array
        const social = userData.socialLinks
            ?.filter((link) => link.url.trim() !== '')
            .map((link) => link.url)

        console.log("USER DDDDD : ", userData);

        const newData = getChangedFields(
            authUser, 
            {
                ...userData,
                socialLinks:social,
                // removedImages //Data from others hooks(parts) 
                ...additionalData
            });
        console.log("Changes DaTA: ", newData);

        if(Object.keys(newData).length === 0 ){
            toast.error("You didn't pass any data!");
            throw new Error("You didn't pass any data");
            // return;
        }

        try{
            if(!authUser.id) throw new Error("You don't have permission to updates");
    
            const farmerID = authUser?.id.toString();
            const result = await updateFarmer({ farmerID, updateData: newData })
            const newUpdatedData = result?.data?.farmer;

            if(!newUpdatedData)
                throw new Error("Validation failed, no data returend from update");
            
            const mappedData = mapFarmerToAuthUser(newUpdatedData, authUser);
            dispatch(updateAuthUser(mappedData));
            
            toast.success("Successfully updated Profile")
            return newUpdatedData;
        }   
        catch(error){
            console.log("Error update Farmer: ", error);
            // -> throw error on called func that will call it with try/catch
            throw error;
        }
    }

    const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        ): void => {
            const { name, value } = e.target;
    
            //handling location object with {city and address prop}
            if(name.startsWith("location.")) { 
                //example for city -> name:location.city
                const locationField = name.split('.')[1];//is 'city value'
                setUserData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        [locationField]: value
                    } as FarmerLocationInterface
                }));
            }
            else { 
                setUserData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        };

    const getBorderErrorStyle = (field: string): string => {
        return validationErrors[field] ? 'border-0 border-b-4 border-red-400' : '';
    };

    return {
        userData, 
        setUserData,
        uploadLoading,
        validationErrors,
        getChangedFields,
        handleSubmit,
        handleChange,
        getBorderErrorStyle
    }
}

export default useFarmerProfile