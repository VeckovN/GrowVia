import { FC, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { LocationMarkerProps } from '../../farmer.interface';

const LocationMarker: FC<LocationMarkerProps> = ({ position, farmName, onMapClick }) => {
    const map = useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return (position === null) ? null : (
        <Marker position={position}>
            <Popup>
            <div>
                <strong>{farmName}</strong>
                <br />
                <small>
                    {position[0]?.toFixed(6)}, {position[1]?.toFixed(6)}
                </small>
            </div>
            </Popup>
        </Marker>
    );
};

export default LocationMarker;