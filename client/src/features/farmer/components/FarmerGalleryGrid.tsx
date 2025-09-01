import { FC, ReactElement } from 'react'; 
import "react-photo-album/masonry.css";
import PhotoAlbum from "react-photo-album";
import { GalleryImageInterface } from '../farmer.interface';

const FarmerGalleryGrid:FC<{images: GalleryImageInterface[]}> = ({ images }): ReactElement => {

    const photos = images.slice(0,6).map(img => ({ //first 6 images
        src: img.url,
        width: 800,  
        height: 600
    }))

    return (
        <div className='w-full max-w-[800px]a mx-auto'>

            {photos.length > 6 && 
                <div className='w-full flex justify-end'>
                    <button 
                        className='font-lato text-sm sm:text-base border rounded-lg border-black p-2 hover:bg-grey'
                        // onClick={() => navigate(`/galleryImages/${farmerID}`)}
                        onClick={() => alert("Images")}
                    >
                        View More {'>'}
                    </button>
                </div>
            }
            
            <div className='pt-6'>
                <PhotoAlbum
                    layout="masonry"
                    photos={photos}
                    spacing={15}
                    columns={(containerWidth) => {
                        if (containerWidth < 400) return 1; 
                        if (containerWidth < 700) return 2; 
                        return 3;     
                    }}
                    render={{
                        image: (props) => (
                        <img
                            {...props}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        ),
                    }}
                />
            </div>
        </div>
    )
}

export default FarmerGalleryGrid