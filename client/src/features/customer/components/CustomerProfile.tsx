import { useState, ChangeEvent, useRef } from "react";
import { ReduxStateInterface } from '../../../store/store.interface';
import { useAppSelector } from '../../../store/store';
import { useAppDispatch } from '../../../store/store';
import { useSchemaValidation } from "../../shared/hooks/useSchemaValidation";
import { useUpdateCustomerMutation } from "../user.service";
import { customerProfileSchema } from "../customer.schema";
import { updateAuthUser } from '../../auth/auth.reducers';

import TextField from "../../shared/inputs/TextField";
import SelectField from "../../shared/inputs/SelectField";
import LoadingSpinner from "../../shared/page/LoadingSpinner";
import toast from 'react-hot-toast';

import { CITIES } from '../../shared/utils/data';
import { readAsBase64 } from '../../shared/utils/utilsFunctions';

import { CustomerProfileInterface } from "../customer.interface";
import { LocationInterface } from "../../auth/auth.interfaces";

import { PiPencil } from "react-icons/pi";

const CustomerProfile = ( ) => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const dispatch = useAppDispatch();

    const [ updateCustomer, { isLoading }] = useUpdateCustomerMutation(); 

    const [userData, setUserData] = useState<CustomerProfileInterface>({
        firstName: authUser.fullName.split(' ')[0],
        lastName: authUser.fullName.split(' ')[1],
        phoneNumber: authUser.phoneNumber,
        location: {
            country:authUser.location.country,
            city:authUser.location.city,
            address:authUser.location.address,
        }, 
        profileAvatarFile: '',
    });

    const [selectedAvatar, setSelectedAvatar] = useState({
        file: null as File | null,
        preview: null as string | null
    })

    console.log("DAT: ", userData);

    const avatarSrc = selectedAvatar.preview || authUser.profileAvatar?.url || '';
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [actionError, setActionError] = useState<string>('');

    const [schemaValidation, validationErrors, resetValidationErrors] = useSchemaValidation({
        schema: customerProfileSchema, 
        userData
    });

    const getFieldError = (fieldName: string) => validationErrors[fieldName];

    const getBorderErrorStyle = (field: string): string =>{
        if(actionError || getFieldError(field))
            return 'border-0 border-b-4 border-red-400';
        else
            return '';
    }

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
            else if (key === 'profileAvatarFile') {
                // Only include if actually set
                if (mergedData[key] && mergedData[key] !== '') {
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

    console.log("val Error:", validationErrors);
    const onSubmitHandler = async():Promise<void> =>{
        const isValid = await schemaValidation(); 

        if(!isValid){
            toast.error("Validation Field error");
            return;
        }

        const newData = getChangedFields(authUser, {...userData});
        console.log("Changes DaTA: ", newData);

        if(Object.keys(newData).length === 0 ){
            console.log("NO changed Data");
            return;
        }

        try{
            if(!authUser.id){
                console.log("Farmer user doesn't exist -> not authenicated")
                return
            }
            const customerID = authUser.id.toString();
            const result = await updateCustomer({customerID, updateData:newData})
            const resultUserData = result.data?.user;

            if(newData.profileAvatarFile){
                const publicID = resultUserData?.profileAvatar?.publicID || '';
                newData.profileAvatar = {
                    url:resultUserData?.profileAvatar?.url,
                    publicID,
                }

                delete newData.profileAvatarFile;
            }

            dispatch(updateAuthUser(newData));
            toast.success("Successfully updated Profile")
        }   
        catch(error){
            console.log("Error update Farmer: ", error);
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
                } as LocationInterface
            }));
        }
        else { 
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleImageFileChange = async ( e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if(!file) return;

        const preview = URL.createObjectURL(file);
        setSelectedAvatar({file, preview});

        try{
            const base64 = await readAsBase64(file);
            setUserData(prev => ({
                ...prev,
                profileAvatarFile: base64,
            }));
        }
        catch(error){
            console.error("Faild to process avatar file:", error);
        }
    }

    const handleRemoveImage = (type: 'avatar' | 'background') => {

        if (selectedAvatar.preview) {
            URL.revokeObjectURL(selectedAvatar.preview!);
        }

        setSelectedAvatar({ file:null, preview:null});
        setUserData(prev => ({
            ...prev,
            profileAvatarFile: ''
        }));
    };


    return (
        <div className="mt-0 space-y-6">
            <h3 className='text-xl ml-3 font-medium'>
                Profile
            </h3>

            <div className='flex justify-center'>
                <div className='px-6 pt-1 pb-5 bg-red-300a flex flex-col items-center justify-between border-2 border-greyB rounded-md'> 
                    <div className="font-lato text-lg font-medium bg-red-400a mb-1">
                        {authUser.fullName}
                    </div>

                    <div className='w-full relative '>
                        <img
                            className='w-36 h-36 rounded-full border-2 border-white shadow-lg object-cover'
                            src={avatarSrc}
                            alt='Avatar'
                        />
                        
                        {/* Hidden file input and attached to the pencil icon*/}
                        {/* ofc this can be done with a "label" instead of ref */}
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            name="profileAvatarFile"
                            ref={avatarInputRef}
                            onChange={handleImageFileChange}
                            className="hidden"
                        />

                        {/* {selectedImages.avatar.preview && ( */}
                        {selectedAvatar.preview && (
                        <div className='absolute top-0 left-20 '>
                            <button
                                className='relative left-6 w-8 h-8 bg-red-500 rounded-full flex justify-center items-center hover:bg-red-600'
                                onClick={() => handleRemoveImage('avatar')}
                                aria-label="Remove avatar"
                            >
                                <span className="text-white text-sm font-bold">×</span>
                            </button>
                        </div>
                        )}
                            
                        <button 
                            className='absolute bottom-0 left-3 p-1 bg-grey rounded-full cursor-pointer hover:bg-gray-300 group'
                            onClick={() => avatarInputRef.current?.click()} //that trigger input 'onClick'
                        >
                            <PiPencil className='text-xl text-gray-600 group-hover:text-gray-800'/>
                        </button>
                    </div>
                </div>
            </div>


            {/* Row 1 - FirstName & LastName */}
            <div className="flex flex-col md:flex-row gap-4 ">
                <div className="w-full md:w-1/2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('firstName')}
                        `}
                        id="firstName" //match label htmlFor 
                        value={userData.firstName}
                        name="firstName"
                        type="text"
                        placeholder='Enter First Name'
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        //     setUserData({ ...userData, firstName: e.target.value})
                        // }}
                        onChange={handleChange}
                    />
                    {validationErrors.firstName &&
                        <label className='text-red-600 text-sm'> {validationErrors.firstName}</label>
                    }
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('lastName')}
                        `}
                        id="lastName" //match label htmlFor 
                        // value={userData.fullName.split('')[1]}
                        value={userData.lastName}
                        name="lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        onChange={handleChange}
                    />
                    {validationErrors.lastName &&
                        <label className='text-red-600 text-sm'> {validationErrors.lastName}</label>
                    }  
                </div>
            </div>

            {/* Row 2 - Username & Email */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 rounded-md shadow-sm 
                            bg-greySbtn text-gray-600
                        `}
                        value={authUser.username}
                        disabled
                        onChange={()=>{}}
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 rounded-md shadow-sm 
                            bg-greySbtn text-gray-500
                        `}
                        value={authUser.email}
                        disabled
                        onChange={()=>{}}
                    />
                </div>
            </div>

            {/* Row 3 - Phone Number (half width) */}
            <div className="w-full md:w-1/2 md:pr-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <TextField
                    className={`
                        w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                        focus:border-green2 focus:border-4
                        ${getBorderErrorStyle('phoneNumber')}
                    `}
                    id="phoneNumber"
                    value={userData.phoneNumber}
                    name="phoneNumber"
                    type="tel"
                    placeholder="+381 or 06x"
                    onChange={handleChange}
                />
                {validationErrors.phoneNumber &&
                    <label className='text-red-600 text-sm'>{validationErrors.phoneNumber}</label>
                }
            </div>

            {/* Row 4 - City & Address */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City
                    </label>
                    <SelectField 
                        className={`p-[11px] pl-4 bg-white text-gray-500 ${getBorderErrorStyle('location')}`}
                        id='city'
                        name='location.city'
                        value={userData.location?.city ?? ''}
                        options={CITIES}
                        onChange={handleChange}
                    />
                    {validationErrors.location &&
                        <label className='text-red-600 text-sm'>{validationErrors.location}</label>
                    }
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('address')}
                        `}
                        id="address"
                        name="location.address"
                        value={userData.location?.address}
                        type="text"
                        placeholder="Address"
                        onChange={handleChange}
                    />
                    {validationErrors.location &&
                        <label className='text-red-600 text-sm'>{validationErrors.location}</label>
                    }
                </div>
            </div>

            <div className='w-full flex justify-center items-center gap-x-3 pt-6'>
                <button 
                    className="w-full max-w-[300px] mx-autoa p-2 border-2 rounded-md text-white font-semibold bg-green7" 
                    onClick={onSubmitHandler}
                > Apply Changes
                </button>
                
                {isLoading &&
                    <div className=''>
                        <LoadingSpinner
                            spinnerClassName='text-green5'
                        />
                    </div>
                }
                    
            </div>
        </div>
    );
}

export default CustomerProfile