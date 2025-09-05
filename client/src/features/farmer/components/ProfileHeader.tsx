import { FC, ReactElement } from "react"
import { ProfileHeaderProps } from "../farmer.interface"
import { PiPencil } from "react-icons/pi"


const ProfileHeader:FC<ProfileHeaderProps>= ({
    backgroundSrc,
    avatarSrc,
    backgroundInputRef,
    avatarInputRef,
    selectedImages,
    onImageFileChange,
    onRemoveImage
}):ReactElement => {
    return (
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
                onChange={onImageFileChange}
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
                    onClick={() => onRemoveImage('background')}
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
                    onChange={onImageFileChange}
                    className="hidden"
                />

                {selectedImages.avatar.preview && (
                <div className='absolute top-0 left-20 '>
                    <button
                        className='relative w-8 h-8 bg-red-500 rounded-full flex justify-center items-center hover:bg-red-600'
                        onClick={() => onRemoveImage('avatar')}
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
    )
}

export default ProfileHeader