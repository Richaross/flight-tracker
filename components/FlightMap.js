'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MovingPlane from './map/MovingPlane';
import FlightMarkers from './map/FlightMarkers';
import { fixLeafletIcons } from '../lib/utils/leaflet';
import { COLORS, MAP_SETTINGS } from '../lib/constants';

function MapUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      // Shift center to the right (2/3 of screen) by adding left padding for the sidebar
      map.fitBounds(bounds, { 
          paddingTopLeft: MAP_SETTINGS.PADDING.TOP_LEFT,
          paddingBottomRight: MAP_SETTINGS.PADDING.BOTTOM_RIGHT
      });
    }
  }, [bounds, map]);
  return null;
}

export default function FlightMap({ flight }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const isFlightSelected = flight && flight.originCoords && flight.destinationCoords;

  const center = isFlightSelected 
    ? L.latLngBounds([flight.originCoords, flight.destinationCoords]).getCenter()
    : MAP_SETTINGS.DEFAULT_CENTER;
  
  const zoom = isFlightSelected ? MAP_SETTINGS.FLIGHT_ZOOM : MAP_SETTINGS.DEFAULT_ZOOM;

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
            <FlightMarkers flight={flight} />

            <Polyline
              positions={[flight.originCoords, flight.destinationCoords]}
              color={COLORS.TURQUOISE}
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
