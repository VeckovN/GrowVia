import uploadImage from '../../../assets/upload.svg';
import { ProfileImagesProps } from "../farmer.interface";

const ProfileImages: React.FC<ProfileImagesProps> = ({
    existingImages,
    previewImages,
    onImagesChange,
    onRemoveExisting,
    onRemovePreview
}) => {
    return (
    <div className="w-full">
        <label className="text-md font-medium text-gray-700">Profile Images</label>
        <p className="py-1 text-xs text-gray-500">
            The first image in the list will be used as the main display picture.
        </p>

        <div className="w-full max-w-[780px] flex flex-wrap border-2 border-greyB rounded-md">
        <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImagesChange}
            className="hidden"
            id="profile-images-upload"
        />
        
        <label
            htmlFor="profile-images-upload"
            className="w-44 h-32 p-4 m-2 flex flex-col border border-greyB rounded-md bg-grey font-lato text-gray-500 cursor-pointer hover:bg-gray-300 hover:border-black group"
        >
            <div className="mt-2 flex flex-col justify-center items-center">
                <img src={uploadImage} alt="upload" className="w-6 h-6" />
                <div className="font-medium group-hover:text-black">
                    Click to upload
                </div>
            </div>
            <p className="mt-2 text-xs text-center group-hover:text-black">
                SVG, PNG, JPG or GIF
            </p>
        </label>

        {/* Existing images */}
        {existingImages?.map((img, index) => (
            <div key={`db-${index}`} className="relative w-44 h-32 m-2 border border-greyB rounded-md">
                <img src={img.url} alt={`Profile ${index}`} className="w-44 h-32 rounded-md object-cover" />
                <button
                    className="absolute top-1 left-1 w-7 h-7 bg-white text-red-800 text-xs font-medium rounded-md cursor-pointer hover:text-red-900"
                    onClick={() => onRemoveExisting(index)}
                >
                    X
                </button>
            </div>
        ))}

        {/* Preview images */}
        {previewImages.map((url, index) => (
            <div key={`preview-${index}`} className="relative w-44 h-32 m-2 border border-greyB rounded-md">
                <img src={url} alt="Preview" className="w-44 h-32 rounded-md object-cover" />
                <button
                    className="absolute top-1 left-1 w-7 h-7 bg-white text-red-800 text-xs font-medium rounded-md cursor-pointer hover:text-red-900"
                    onClick={() => onRemovePreview(index)}
                >
                    X
                </button>
            </div>
        ))}
        </div>
    </div>
    );
};

export default ProfileImages