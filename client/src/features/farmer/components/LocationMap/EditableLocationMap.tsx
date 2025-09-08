import { FC } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import { EditableLocationMapProps } from '../../farmer.interface';

const EditableLocationMap:FC<EditableLocationMapProps> = ({
    position,
    farmName,
    locationMode,
    hasValidPosition,
    onLocationModeChange,
    onMapClick
}) => {
    const DEFAULT_POSITION:[number,number] = [44.7866, 20.4489];

    const shouldShowMap = hasValidPosition || locationMode !== null;
    const mapCenter = hasValidPosition && position ? position : DEFAULT_POSITION;
    const markerPosition =  position ? position : null;

    return (
        <div className={`w-full ${shouldShowMap ? 'h-72 md:h-80 mb-24' : ''} `}>
            <label htmlFor="location" className="text- font-medium text-gray-700">
                Map Location
            </label>

            <div className="mt-1 flex flex-col gap-y-1">
                <div className="flex items-center space-x-2">
                    <input
                        className="text-green-600"
                        type="radio"
                        id="auto-location"
                        name="location-mode"
                        value="auto"
                        checked={locationMode === 'auto'}
                        onChange={() => onLocationModeChange('auto')}
                    />
                    <label htmlFor="auto-location" className="text-sm font-medium text-gray-700">
                        {/* Use your current location {isLoadingLocation && '(Loading...)'} */}
                        Use your current location 
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        className="text-green-600"
                        type="radio"
                        id="manual-location"
                        name="location-mode"
                        value="manual"
                        checked={locationMode === 'manual'}
                        onChange={() => onLocationModeChange('manual')}
                    />
                    <label htmlFor="manual-location" className="text-sm font-medium text-gray-700">
                        Select location manually on map
                    </label>
                </div>
            </div>
                

            {shouldShowMap
            ?
                <div className='h-full w-full'>
                    <MapContainer
                        center={mapCenter}
                        zoom={position ? 14 : 13}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                        key={`map-${position ? position.join(',') : 'default'}`}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            position={markerPosition}
                            farmName={farmName}
                            onMapClick={onMapClick}
                        />
                    </MapContainer>
                </div>

            :

            <div className="mt-1 bg-blue-50 border border-blue-100 p-3 rounded-md">
                <p className="text-gray-500 text-sm ">
                    No location set. Please select your farm location using one of the options above.
                </p>
            </div>
        
            }
        </div>
    )
}

export default EditableLocationMap;