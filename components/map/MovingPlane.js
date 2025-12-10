'use client';

import { useEffect, useState, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { COLORS } from '../../lib/constants';

/**
 * Renders an animated plane icon moving between two coordinates over a specific time duration.
 * 
 * @param {Object} props
 * @param {Array<number>} props.startCoords - [lat, lng]
 * @param {Array<number>} props.endCoords - [lat, lng]
 * @param {string|number} props.startTime - ISO string or timestamp
 * @param {string|number} props.endTime - ISO string or timestamp
 */
export default function MovingPlane({ startCoords, endCoords, startTime, endTime }) {
    const [currentPos, setCurrentPos] = useState(startCoords);
    const planeIconRef = useRef(null);

    // Initialize Custom Plane Icon
    if (!planeIconRef.current) {
        // SVG Plane Icon
        const svgPlane = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.TURQUOISE}" width="48px" height="48px" style="transform: rotate(45deg); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>`;
        
        planeIconRef.current = L.divIcon({
            html: svgPlane,
            className: 'plane-icon',
            iconSize: [48, 48],
            iconAnchor: [24, 24], 
        });
    }

    useEffect(() => {
        if (!startCoords || !endCoords) return;

        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        
        const animate = () => {
            const currentTime = Date.now();
            
            // Before start: Stay at start
            if (currentTime < start) {
                 setCurrentPos(startCoords);
                 requestAnimationFrame(animate);
                 return;
            }

            // After end: Stay at end
            if (currentTime > end) {
                setCurrentPos(endCoords);
                return;
            }

            // In progress: Interpolate
            const duration = end - start;
            const elapsed = currentTime - start;
            const progress = elapsed / duration;

            // Simple Linear Interpolation (Lerp)
            const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
            const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;

            setCurrentPos([lat, lng]);
            requestAnimationFrame(animate);
        };
        
        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);

    }, [startTime, endTime, startCoords, endCoords]);

    return <Marker position={currentPos} icon={planeIconRef.current} zIndexOffset={1000} />;
}
