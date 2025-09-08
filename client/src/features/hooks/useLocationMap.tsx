import { useEffect, useState} from 'react';
import { UseLocationMapResultProps } from '../farmer/farmer.interface';

const useLocationMap = ({latitude, longitude}
    : {latitude: number | null, longitude: number | null}): UseLocationMapResultProps => {

    const initialPosition: [number, number] | null = (latitude && longitude && 
        !isNaN(latitude) && !isNaN(longitude) && 
        latitude !== 0 && longitude !== 0) 
        ? [latitude, longitude] 
        : null;

    const [position, setPosition] = useState<[number, number] | null>(initialPosition);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    
    const hasValidPosition = Boolean(latitude && longitude && 
        !isNaN(latitude) && !isNaN(longitude) && 
        latitude !== 0 && longitude !== 0);

    const [locationMode, setLocationMode] = useState<'auto' | 'manual' | null>(
        hasValidPosition ? 'manual' : null);

    useEffect(() => {
        if(!latitude || !longitude)
            return;

        if(hasValidPosition){
            setPosition([latitude, longitude])
        }
    },[latitude, longitude, hasValidPosition])

    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        
        if(!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser")
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                setPosition(newPos);
                setIsLoadingLocation(false);
            },
            (error) => {
                setIsLoadingLocation(false);
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    //get lat,lon by location: address,city and country
    const geocodeAddress = async (address: string, city: string, country: string = 'Serbia') => {
        try{
            const query = encodeURIComponent(`${address}, ${city}, ${country}`);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setPosition([lat, lon]);
                return { lat, lon };
            }
            return null;
        }
        catch(error) {
            console.error("geocoding error: ", error);
            return null;
        }
    }

    //getLoation address, city and country based on clicked in map (ofc langitude)
    const reverseGeocode = async (lat:number, lng:number) => {
        try{
            setPosition([lat, lng]);
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data?.display_name || ''; 
        }
        catch(error){
            console.error('Reverse geocoding error:', error);
            return '';
        }
    }

    const parseCoordinate = (value: string | undefined | null): number | null => {
        if (!value || value.trim() === '') return null;
        const parsed = Number(value);
        return !isNaN(parsed) ? parsed : null;
    };

    return {
        position,
        getCurrentLocation,
        hasValidPosition,
        locationMode,
        setLocationMode,
        isLoadingLocation,
        geocodeAddress,
        reverseGeocode,
        parseCoordinate
    }
}

export default useLocationMap;