'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
const fixLeafletIcons = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

function MapUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      // Shift center to the right (2/3 of screen) by adding left padding for the sidebar
      map.fitBounds(bounds, { 
          paddingTopLeft: [450, 50],
          paddingBottomRight: [50, 50]
      });
    }
  }, [bounds, map]);
  return null;
}

function MovingPlane({ startCoords, endCoords, startTime, endTime }) {
    const [currentPos, setCurrentPos] = useState(startCoords);
    const planeIconRef = useRef(null);

    // Custom Plane Icon
    if (!planeIconRef.current) {
        const svgPlane = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06b6d4" width="48px" height="48px" style="transform: rotate(45deg); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
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
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = Date.now();

        // If flight hasn't started, stay at start. If ended, stay at end.
        if (now < start) {
            setCurrentPos(startCoords);
            return;
        }
        if (now > end) {
            setCurrentPos(endCoords);
            return;
        }

        const duration = end - start;
        
        const animate = () => {
            const currentTime = Date.now();
            if (currentTime > end) {
                setCurrentPos(endCoords);
                return;
            }

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

export default function FlightMap({ flight }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const defaultCenter = [40.7128, -74.0060]; // Default to New York or World
  const defaultZoom = 2;
  const isFlightSelected = flight && flight.originCoords && flight.destinationCoords;

  const center = isFlightSelected 
    ? L.latLngBounds([flight.originCoords, flight.destinationCoords]).getCenter()
    : [20, 0];
  
  const zoom = isFlightSelected ? 4 : 2;

  // Calculate bounds if flight exists
  let bounds = null;
  if (isFlightSelected) {
    bounds = L.latLngBounds([flight.originCoords, flight.destinationCoords]);
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        key={isFlightSelected ? flight.flightNumber : 'default'}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full outline-none"
        style={{ height: '100%', width: '100%', background: '#f1f5f9' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        
        {/* Add labels on top of tiles if desired, or use 'voyager' which has labels */}
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            zIndex={100}
        />

        {isFlightSelected && (
          <>
            {/* Origin Marker (Cyan) */}
            <Marker 
                position={flight.originCoords}
                icon={L.divIcon({
                    className: 'custom-icon',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06b6d4" width="36px" height="36px" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -36]
                })}
            >
              <Popup className="font-bold">
                {flight.origin}<br /><span className="text-cyan-500 font-normal">Departure</span>
              </Popup>
            </Marker>
        
        {/* Destination Marker (Violet) */}
        <Marker 
            position={flight.destinationCoords}
            icon={L.divIcon({
                className: 'custom-icon',
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8b5cf6" width="36px" height="36px" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                popupAnchor: [0, -36]
            })}
        >
          <Popup className="font-bold">
            {flight.destination}<br /><span className="text-violet-500 font-normal">Arrival</span>
          </Popup>
        </Marker>

            <Polyline
              positions={[flight.originCoords, flight.destinationCoords]}
              color="#06b6d4" 
              weight={4}
              opacity={0.6}
              dashArray="10, 15"
              lineCap="round"
            />

            <MovingPlane 
                startCoords={flight.originCoords} 
                endCoords={flight.destinationCoords} 
                startTime={flight.startTime} 
                endTime={flight.endTime} 
            />

            <MapUpdater bounds={bounds} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
