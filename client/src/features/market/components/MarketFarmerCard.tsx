import { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketFarmerCardInterface } from '../market.interface';

const MarketFarmerCard:FC<MarketFarmerCardInterface> = ({farmer}):ReactElement => {
    const navigate = useNavigate();

    return (
        <div className='w-full flex min-w-[380px] border rounded-md bg-gray-50'>
            <div 
                className='min-w-[150px] h-28 relative rounded-md bg-cover bg-centera opacity-4'
                style={{backgroundImage: `url(${farmer.backgroundImage?.url})`}}
            >
                <div className="absolute inset-0 bg-white/20" /> 
                <img
                    src={farmer.profileAvatar?.url}
                    alt={`overlay-${farmer.farmName}`}
                    className='w-[80px] h-[55px] absolute left-1/2 -translate-x-1/2 translate-y-1/2 shadow-md object-cover rounded-md'
                />
           </div>

           <div className='flex flex-col flex-1 px-3 justify-around gap-y-2a'>
                <div className='flex flex-col'>
                    <h4 className='font-semibold'>{farmer.farmName}</h4>
                    <p className='text-xs text-gray-500'>{farmer.location?.address}, {farmer.location?.city} </p>
                </div>

                <div className='w-full flex gap-x-1 ml-3a'>
                    {farmer.profileImages?.slice(0,4).map(image => 
                        <img 
                            className='w-[50px] h-[40px] object-cover shadow-md rounded-md'
                            src={image.url}
                        />
                    )}
                </div>

                <div className='w-full flex justify-center'>
                    <button 
                        className='px-5 py-1 text-xs rounded-md border border-greyB hover:bg-gray-100'
                        onClick={() => navigate(`/farmer/overview/${farmer.userID}`)}
                    >
                        View Full
                    </button>
                </div>
           </div>
        </div>
    )
}

export default MarketFarmerCard;