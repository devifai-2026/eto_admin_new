import { useState, useEffect } from 'react';

// Get your Google API key from environment variables
const GOOGLE_API_KEY = "AIzaSyADoCI2hyTYNI3jXfG4jRZzVu0qdMMEH4Q";

const reverseGeocode = async (lat, lng) => {
    // Validate coordinates
    if (!isValidCoordinate(lat, lng)) {
        return 'Invalid coordinates';
    }

    // If no API key is available, return formatted coordinates as fallback
    if (!GOOGLE_API_KEY) {
        return formatCoordinates(lat, lng);
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            return getBestAddressResult(data.results);
        } else if (data.status === 'ZERO_RESULTS') {
            return 'Remote location';
        } else {
            console.warn('Geocoding API error:', data.status, data.error_message);
            return formatCoordinates(lat, lng);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return formatCoordinates(lat, lng);
    }
};

// Helper function to validate coordinates
const isValidCoordinate = (lat, lng) => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

// Helper function to format coordinates consistently
const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Helper function to find the best address from geocoding results
const getBestAddressResult = (results) => {
    // Priority order for address types
    const priorityTypes = [
        'street_address',
        'route',
        'neighborhood',
        'sublocality',
        'locality',
        'administrative_area_level_2', // County
        'administrative_area_level_1', // State
        'country'
    ];

    // Try to find the most specific address
    for (const type of priorityTypes) {
        const result = results.find(r => r.types.includes(type));
        if (result) {
            return result.formatted_address;
        }
    }

    // Fallback to the first result
    return results[0].formatted_address;
};

const LocationName = ({
    coordinates,
    fallbackText = "Location not available",
    className = ""
}) => {
    const [address, setAddress] = useState('Loading location...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAddress = async () => {
            if (!coordinates || coordinates.length !== 2) {
                if (isMounted) {
                    setAddress(fallbackText);
                    setIsLoading(false);
                }
                return;
            }

            try {
                if (isMounted) {
                    setIsLoading(true);
                    setError(null);
                }

                const [lng, lat] = coordinates; // Note: coordinates are usually [lng, lat]
                const result = await reverseGeocode(lat, lng);
                
                if (isMounted) {
                    setAddress(result);
                }
            } catch (err) {
                console.error('Error in location name component:', err);
                if (isMounted) {
                    setError('Failed to load address');
                    setAddress(formatCoordinates(coordinates[1], coordinates[0]));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAddress();

        return () => {
            isMounted = false;
        };
    }, [coordinates, fallbackText]);

    if (error) {
        return (
            <span className={`text-red-500 ${className}`} title={error}>
                {address}
            </span>
        );
    }

    return (
        <span 
            className={`${isLoading ? 'text-gray-400 animate-pulse' : ''} ${className}`}
            title={isLoading ? 'Loading address...' : address}
        >
            {isLoading ? 'Loading...' : address}
        </span>
    );
};

export default LocationName;