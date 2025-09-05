import { ChangeEvent, useState, useRef } from 'react';
import { readAsBase64 } from '../shared/utils/utilsFunctions';

const useProfileHeaderImages = () => {
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageFileChange = async ( 
        e: ChangeEvent<HTMLInputElement>,
        onUpdateImageFile: (name:string, base64File: string) => void,
    ): Promise<void> => {
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
            onUpdateImageFile(name, base64);
        }
        catch(error){
            console.error("Faild to process avatar file:", error);
        }
    }

    const handleRemoveImage = (
        type: 'avatar' | 'background',
        onUpdateImage: () => void
    ) => {
        // Clean up object URL
        if (selectedImages[type].preview) {
            URL.revokeObjectURL(selectedImages[type].preview!);
        }

        setSelectedImages(prev => ({
            ...prev,
            [type]: { file: null, preview: null }
        }));

        onUpdateImage();
    };

    return {
        backgroundInputRef,
        avatarInputRef,
        selectedImages,
        handleImageFileChange,
        handleRemoveImage
    }
}

export default useProfileHeaderImages