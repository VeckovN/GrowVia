import { ChangeEvent } from 'react';
import { useAppSelector } from '../../../store/store';
import SocialLinks from '../../shared/user/SocialLinks';
import toast from 'react-hot-toast';
import { ReduxStateInterface } from '../../../store/store.interface';
import LoadingSpinner from '../../shared/page/LoadingSpinner';

import useFarmerProfile from '../../hooks/useFarmerProfile';
import useProfileImages from '../../hooks/useProfileImages';
import useProfileHeaderImages from '../../hooks/useProfileHeaderImages';

import ProfileHeader from './ProfileHeader';
import InfoForm from './InfoForm';
import ProfileImages from './ProfileImages';

const FarmerProfile = () => {
    const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)

    const {
        userData, 
        setUserData,
        uploadLoading,
        validationErrors,
        handleSubmit,
        handleChange,
        getBorderErrorStyle
    } = useFarmerProfile(authUser);

    const {
        backgroundInputRef,
        avatarInputRef,
        selectedImages,
        handleImageFileChange,
        handleRemoveImage
    } = useProfileHeaderImages();
    
    const {
        profileImages, 
        existingProfileImages,
        removedImages,
        handleProfileImagesChange,
        handleRemovePreviewProfileImage,
        handleRemoveExistingProfileImage
    } = useProfileImages(authUser);


    const avatarSrc = selectedImages.avatar.preview || authUser.profileAvatar?.url || '';
    const backgroundSrc = selectedImages.background.preview || authUser.backgroundImage?.url || '';

    const onSubmitHandler = async () => {
        const additionalData = { removedImages }
        try{
            //passed aditional components (from other parts)
            await handleSubmit(additionalData);
            // await handleSubmit({removedImages});
        }
        catch(error){
            console.log("onSubmitHandler ERROR: ", error);
            toast.error(error); //caught from trown new Error in useFarmerProfile hook
        } 
    }

    const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        try{ 
            //anonymous callback func approach
            handleImageFileChange(e, (name, base64) => {
                setUserData(prev => ({
                    ...prev,
                    [name]: base64,
                }));
            })
        }
        catch(error){
            console.error("Faild to process avatar file:", error);
        }
    }

    const onRemoveImage = (type: 'avatar' | 'background') => {
        handleRemoveImage(type, () => {
            setUserData(prev => ({
                ...prev,
                [type === 'avatar' ? 'profileAvatarFile' : 'backgroundImageFile']: ''
            }));
        });
    };

    const onProfileImagesChange = async (e:ChangeEvent<HTMLInputElement>, ) :Promise<void> => {
        try{
            //defined callback 
             const updateProfileImages = (base64Files: string[]): void => {
                setUserData((prev) => ({
                    ...prev,
                    profileImagesFile: [
                    ...(prev.profileImagesFile || []),
                    ...base64Files,
                    ],
                }));
            };

            //base64Files will be got when is updateFun(passed) called with hanl;deProfileImagesChange
            await handleProfileImagesChange(e, updateProfileImages);
        }
        catch(error){
            console.log("Error handling profile images", error);
        }   
    }

    const onRemovePreviewProfileImage = (index: number): void => {
        const updateUserData = (removeIndex: number) => {
            setUserData((prev) => ({
            ...prev,
            profileImagesFile: prev.profileImagesFile?.filter((_, i) => i !== removeIndex) || [],
            }));
        };

        handleRemovePreviewProfileImage(index, updateUserData);
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
        
        <ProfileHeader
            backgroundSrc={backgroundSrc}
            avatarSrc={avatarSrc}
            backgroundInputRef={backgroundInputRef}
            avatarInputRef={avatarInputRef}
            selectedImages={selectedImages}
            onImageFileChange={onImageFileChange}
            onRemoveImage={onRemoveImage}
        />

        <div className='flex justify-end gap-x-3'>
            <SocialLinks links={userData.socialLinks!}/>
        </div>

        <InfoForm 
            userData={userData}
            authUser={authUser}
            validationErrors={validationErrors}
            onChange={handleChange}
            getBorderErrorStyle={getBorderErrorStyle}
            handleSocialChange={handleSocialChange}
        />        

        <ProfileImages
            existingImages={existingProfileImages}
            previewImages={profileImages.previews}
            onImagesChange={onProfileImagesChange}
            onRemoveExisting={handleRemoveExistingProfileImage}
            onRemovePreview={onRemovePreviewProfileImage}
        />
                    
        <div className='w-full flex justify-center items-center gap-3'>  
            <button 
                className="w-full max-w-[300px] p-2 border-2 ml-2 rounded-md text-white font-semibold bg-green7" 
                onClick={onSubmitHandler}
            > 
                Apply Changes
            </button>

            {uploadLoading &&
            <div>
                <LoadingSpinner
                    spinnerClassName='text-green5'
                />
            </div>
            }
        </div>
    </div>
  );
}

export default FarmerProfile;