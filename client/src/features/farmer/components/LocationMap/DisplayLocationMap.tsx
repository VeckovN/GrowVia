import { FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

interface DisplayLoactionMapProps {
    position: [number, number] | null,
    farmName: string,
}

const DisplayLocationMap: FC<DisplayLoactionMapProps> = ({
    position,
    farmName,
}) => {
    if(!position) return;

    return (
        <div className={`w-full h-72 md:h-80`}>
            <MapContainer
                center={position}
                zoom={position ? 14 : 13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                key={`map-${position ? position.join(',') : 'default'}`}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
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
            </MapContainer>
        </div>
    )
}

export default DisplayLocationMap