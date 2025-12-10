import { ApiClient } from '../utils/api-client';

const API_KEY = process.env.AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

// Private client instance
const client = new ApiClient(BASE_URL);

/**
 * Service for Flight related operations.
 * Decouples API provider details from the consumer.
 */
export const flightService = {
    
    /**
     * Fetches airport details by IATA code.
     * @param {string} iataCode 
     * @returns {Promise<{coords: number[]|null, name: string|null}>}
     */
    async getAirportDetails(iataCode) {
        if (!iataCode) return { coords: null, name: null };
        
        try {
            // Aviationstack returns a 'data' array wrapper
            const data = await client.get('/airports', {
                access_key: API_KEY,
                iata_code: iataCode
            });

            if (data.data && data.data.length > 0) {
                const airport = data.data[0];
                return {
                    coords: [parseFloat(airport.latitude), parseFloat(airport.longitude)],
                    name: airport.airport_name
                };
            }
        } catch (error) {
            console.warn(`[FlightService] Failed to fetch details for airport: ${iataCode}`, error.message);
        }
        return { coords: null, name: null };
    },

    /**
     * Search for a flight by number/IATA.
     * @param {string} flightIata 
     * @returns {Promise<Array>} List of formatted flight objects
     */
    async searchFlight(flightIata) {
        if (!flightIata) return [];

        try {
             const flightData = await client.get('/flights', {
                access_key: API_KEY,
                flight_iata: flightIata,
                limit: 1 // We prioritize the most recent one
            });

            if (!flightData.data || flightData.data.length === 0) {
                return [];
            }

            const flight = flightData.data[0];

            // Parallel fetch for coordinates
            const originIata = flight.departure.iata;
            const destinationIata = flight.arrival.iata;

            const [originDetails, destinationDetails] = await Promise.all([
                this.getAirportDetails(originIata),
                this.getAirportDetails(destinationIata)
            ]);

            // DTO Transformation (Data Transfer Object)
            return [{
                flightNumber: flight.flight.iata,
                airline: flight.airline.name,
                origin: originIata,
                destination: destinationIata,
                originName: originDetails.name || flight.departure.airport || originIata,
                destinationName: destinationDetails.name || flight.arrival.airport || destinationIata,
                startTime: flight.departure.scheduled,
                endTime: flight.arrival.scheduled,
                status: flight.flight_status,
                originCoords: originDetails.coords,
                destinationCoords: destinationDetails.coords,
            }];

        } catch (error) {
            console.error('[FlightService] Search Failed:', error);
            throw error; // Propagate to controller for 500 response
        }
    }
};
