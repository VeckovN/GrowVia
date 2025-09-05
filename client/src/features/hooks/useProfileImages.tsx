import { ChangeEvent, useState} from 'react';
import { readAsBase64 } from '../shared/utils/utilsFunctions';
import { AuthUserInterface } from '../auth/auth.interfaces';

//get auth from faremerProfile.tsx ()
const useProfileImages = (authUser: AuthUserInterface) => {
    const [profileImages, setProfileImages] = useState<{
        files: File[],
        previews: string[];
    }>({files: [], previews: []})

    const [existingProfileImages, setExistingProfileImages] = useState<{ url: string; publicID: string }[]>(
        authUser.profileImages || []
    );
    //seperated state for removing existing images
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    const handleProfileImagesChange = async (
        e:ChangeEvent<HTMLInputElement>, 
        onUpdate: (base64Files: string[]) => void
    ) :Promise<void> => {
        //onUpdate is callback
        const files = e.target.files;
        if(!files) return;

        const selectedFiles = Array.from(files);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));

        const base64Files = await Promise.all(selectedFiles.map(readAsBase64));

        setProfileImages((prev) => ({
            files: [...prev.files, ...selectedFiles],
            previews: [...prev.previews, ...previews]
        }));

        onUpdate(base64Files);
    }

    const handleRemovePreviewProfileImage = (
        index: number,
        onUpdateFiles: (index: number) => void
    ) => {
        setProfileImages((prev) => {
            URL.revokeObjectURL(prev.previews[index]);

            return {
                files: prev.files.filter((_, i) => i !== index),
                previews: prev.previews.filter((_, i) => i !== index),
            };
        });

        onUpdateFiles(index) 
        //actually use same index as passed so maybe this isn't necessary
        // onUpdateFiles();
    };

    const handleRemoveExistingProfileImage = (index: number) => {
        const imageToRemove = authUser.profileImages?.[index];
        if (!imageToRemove) return;

        setRemovedImages((prev) => [...prev, imageToRemove.publicID]);
        setExistingProfileImages((prev) => prev.filter((_, i) => i !== index))
    };

    return {
        profileImages, 
        existingProfileImages,
        removedImages,
        handleProfileImagesChange,
        handleRemovePreviewProfileImage,
        handleRemoveExistingProfileImage
    }
}

export default useProfileImages;