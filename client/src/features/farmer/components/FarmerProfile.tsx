import { ChangeEvent, useState, useRef } from 'react';
import TextField from "../../shared/inputs/TextField";
import SelectField from '../../shared/inputs/SelectField';
import SocialLinks from '../../shared/user/SocialLinks';
import toast from 'react-hot-toast';
import { FarmerLocationInterface, LocationInterface } from '../../auth/auth.interfaces';
import { FarmerProfileInterface } from '../farmer.interface';
import { farmerProfileSchema } from '../farmer.schema';
import { updateAuthUser } from '../../auth/auth.reducers';
import { ReduxStateInterface } from '../../../store/store.interface';
import { useAppSelector } from '../../../store/store';
import { useAppDispatch } from '../../../store/store';
import { useSchemaValidation } from '../../shared/hooks/useSchemaValidation';
import { useUpdateFarmerMutation } from '../farmer.service';
import { CITIES, SOCIAL } from '../../shared/utils/data';
import { readAsBase64 } from '../../shared/utils/utilsFunctions';


import { PiPencil } from "react-icons/pi";

const FarmerProfile = () => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)
    const dispatch = useAppDispatch();
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [ updateFarmer ] = useUpdateFarmerMutation();

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

    const [selectedImages, setSelectedImages] = useState({
        avatar: {
            file: null as File | null,
            preview: null as string | null
        },
        background: {
            file: null as File | null,
            preview: null as string | null
        }
    });

    const avatarSrc = selectedImages.avatar.preview || authUser.profileAvatar?.url || '';
    const backgroundSrc = selectedImages.background.preview || authUser.backgroundImage?.url || '';

    const [actionError, setActionError] = useState<string>('');

    const [schemaValidation, validationErrors, resetValidationErrors] = useSchemaValidation({
        schema: farmerProfileSchema, 
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

            else {
                if (mergedData[key] !== original?.[key]) {
                    changes[key] = mergedData[key];
                }
            }
        }
        return changes;
    };

    console.log("val Error:", validationErrors);
    //dealing with partial updates (e.g., PATCH instead of PUT)
    const onSubmitHandler = async():Promise<void> =>{

        const isValid = await schemaValidation(); 

        if(!isValid){
            toast.error("Validation Field error");
            return;
        }

        //transform socialLinks objects to string array
        const social = userData.socialLinks
            ?.filter((link) => link.url.trim() !== '')
            .map((link) => link.url)

        // const changes = getChangedFields(authUser, userData);
        const newData = getChangedFields(authUser, {...userData, socialLinks:social});
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
            const farmerID = authUser.id.toString();
            const result = await updateFarmer({farmerID, updateData:newData})
            console.log("update product result: ", result);

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


    const handleImageFileChange = async ( e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        const name = e.target.name;
        if(!file) return;

        const preview = URL.createObjectURL(file);
        setSelectedImages(prev => ({
            ...prev,
            [name === 'profileAvatarFile' ? 'avatar' : 'background']: {
                file,
                preview
            }
        }));

        try{
            const base64 = await readAsBase64(file);
            setUserData(prev => ({
                ...prev,
                [name]: base64,
            }));
        }
        catch(error){
            console.error("Faild to process avatar file:", error);
        }
    }

    const handleRemoveImage = (type: 'avatar' | 'background') => {
        // Clean up object URL
        if (selectedImages[type].preview) {
            URL.revokeObjectURL(selectedImages[type].preview!);
        }

        // Reset to default
        setSelectedImages(prev => ({
            ...prev,
            [type]: { file: null, preview: null }
        }));

        // Clear from form data
        setUserData(prev => ({
            ...prev,
            [type === 'avatar' ? 'profileAvatarFile' : 'backgroundImageFile']: ''
        }));
    };

    const handleSocialChange = (index: number, value: string) => {
        setUserData((prev) => {
            const updatedLinks = [...(prev.socialLinks || [])];
            updatedLinks[index] = {
                ...updatedLinks[index],
                url: value,
            };
            return {
                ...prev,
                socialLinks: updatedLinks,
            };
    });
    }

    
    return (
    <div className="mt-0 space-y-6">
        <h3 className='text-xl ml-3 font-medium'>
            Profile
        </h3>
        <div 
            className='relative w-full h-56 bg-cover bg-center overflow-hidden rounded '
            // style={{ backgroundImage: `url(${authUser.backgroundImage?.url})`}}
            style={{ backgroundImage: `url(${backgroundSrc})`}}
        >
            {/* Hidden file input and attached to the pencil icon*/}
            {/* ofc this can be done with a "label" instead of ref */}
            <input
                type="file"
                accept="image/*"
                id="background-upload"
                name="backgroundImageFile"
                ref={backgroundInputRef}
                onChange={handleImageFileChange}
                className="hidden"
            />
            <button 
                className='absolute left-2 bottom-2 p-1 bg-grey rounded cursor-pointer hover:bg-gray-300 group'
                // onClick={onEditProfileAvatar}
                onClick={() => backgroundInputRef.current?.click()}
            >
                <PiPencil className='text-2xl text-gray-600 group-hover:text-gray-800'/>
            </button>

            {/* Remove Button (only shows when new background is selected) */}
            {selectedImages.background.preview && (
            <div className='absolute top-2 right-2 w-8 h-8 group'>
                <button
                    // className='w-full h-full cursor-pointer  '
                    className="w-full h-full cursor-pointer bg-red-500 group-hover:bg-red-600 rounded-full flex justify-center items-center"
                    onClick={() => handleRemoveImage('background')}
                >
                    {/* <div className="w-full h-full text-white font-bold text-sm flex justify-center items-center bg-red-500 rounded-full border group-hover:bg-red-600">X</div> */}
                    <span className="text-white font-bold text-xs">X</span>
                </button>
            </div>
            )}

            <div className='relative ml-6 mt-6'> 
                <img
                    className='w-32 h-32 rounded-full border-2 border-white shadow-lg object-cover'
                    // src={authUser.profileAvatar?.url}
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

                {selectedImages.avatar.preview && (
                <div className='absolute top-0 left-20 '>
                    <button
                        className='relative w-8 h-8 bg-red-500 rounded-full flex justify-center items-center hover:bg-red-600'
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

        <div className='flex justify-end gap-x-3'>
            <SocialLinks links={userData.socialLinks!}/>
        </div>

        {/* Row 1 - FarmName (half width) */}
        <div className="w-full md:w-1/2 md:pr-2">
            <label htmlFor="farmerName" className="text-sm font-medium text-gray-700">
            Farm Name
            </label>
            <TextField
                className={`
                    w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                    focus:border-green2 focus:border-4
                    ${getBorderErrorStyle('farmName')}
                `}
                id="farmerName"
                value={userData.farmName}
                name="farmName"
                type="text"
                placeholder="Enter Farm Name"
                onChange={handleChange}
            />
            {validationErrors.farmName &&
                <label className='text-red-600 text-sm'>{validationErrors.farmName}</label>
            }
        </div>
    
        {/* Row 2 - FirstName & LastName */}
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

        {/* Row 3 - Username & Email */}
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

        {/* Row 4 - Phone Number (half width) */}
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

        {/* Row 6 - City & Address */}
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

        {/* Row 8 - Description (full width) */}
        <div className="w-full ">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
            </label>
            <textarea
                className='w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4'
                id="description"
                name='description'
                value={userData.description}
                placeholder="Enter a detailed description to be shown on the full profile"
                onChange={handleChange}
            >
            </textarea>
            {validationErrors.description &&
                <label className='text-red-600 text-sm'>{validationErrors.description}</label>
            }
        </div>

        <div className='w-full'>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
               Map Location
            </label>
            <div className=''>
                <TextField
                    className={`
                        
                    `}
                    id="location"
                    name="location"
                    value={userData.location?.address}
                    type="radio"
                    placeholder="Address"
                    // onChange={handleChange}
                />
                <label> Use your location (enable it)</label>
            </div>
            <div className=''>
                <TextField
                    className={`
                        
                    `}
                    id="location"
                    name="location"
                    value={userData.location?.address}
                    type="radio"
                    placeholder="Address"
                    // onChange={handleChange}
                />
                <label> Select manually your location </label>
            </div>


            <div className='google map'>

            </div>
        </div>


        <div className="w-full md:w-1/2">
            <label htmlFor="social" className="text-sm font-medium text-gray-700 ">
                Social
            </label>
            {userData.socialLinks?.map((el, index) => (
                <div key={`${el.name}`} className='my-2'>
                    <label  htmlFor={el.name} className="text-sm font-medium text-gray-700">
                        {`${el.name}`}
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('social')}
                        `}
                        id="el.name"
                        name={el.name}
                        value={el.url || ''}
                        type="text"
                        placeholder={`Enter ${el.name} link`}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                    />
                </div>
            ))}
        </div>
                    
        
        <button 
            className="w-full max-w-[300px] mx-auto p-2 mt-6 border-2 rounded-md text-white font-semibold bg-green7" 
            onClick={onSubmitHandler}
        > Apply Changes
        </button>
    </div>
  );
}

export default FarmerProfile;