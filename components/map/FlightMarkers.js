'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { COLORS } from '../../lib/constants';

/**
 * Renders the Origin and Destination markers for a flight.
 * 
 * @param {Object} props
 * @param {Object} props.flight - The flight data object
 */
export default function FlightMarkers({ flight }) {
    if (!flight || !flight.originCoords || !flight.destinationCoords) return null;

    const createIcon = (color) => {
        return L.divIcon({
            className: 'custom-icon',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36px" height="36px" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36]
        });
    };

    return (
        <>
            {/* Origin Marker */}
            <Marker 
                position={flight.originCoords}
                icon={createIcon(COLORS.TURQUOISE)}
            >
                <Popup className="font-bold">
                    {flight.origin}<br />
                    <span className="text-cyan-500 font-normal">Departure</span>
                </Popup>
            </Marker>
        
            {/* Destination Marker */}
            <Marker 
                position={flight.destinationCoords}
                icon={createIcon(COLORS.VIOLET)}
            >
                <Popup className="font-bold">
                    {flight.destination}<br />
                    <span className="text-violet-500 font-normal">Arrival</span>
                </Popup>
            </Marker>
        </>
    );
}
