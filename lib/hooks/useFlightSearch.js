import { useState, useCallback } from 'react';

/**
 * Hook to manage flight search state and API calls.
 * @param {Function} [onStateChange] Optional callback for state updates
 */
export function useFlightSearch(onStateChange) {
    const [query, setQuery] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lastSearchedQuery, setLastSearchedQuery] = useState('');

    const search = useCallback(async () => {
        if (!query) return;

        setLoading(true);
        setSearched(true);
        setLastSearchedQuery(query);
        if (onStateChange) onStateChange(true, true, 0);

        try {
            const res = await fetch(`/api/flights?query=${query}`);
            const data = await res.json();
            
            // Handle error response from API
            if (data.error) {
                 setFlights([]);
                 if (onStateChange) onStateChange(false, true, 0);
                 return;
            }

            setFlights(data);
            if (onStateChange) onStateChange(false, true, data.length);

        } catch (error) {
            console.error('Error fetching flights:', error);
            setFlights([]);
            if (onStateChange) onStateChange(false, true, 0);
        } finally {
            setLoading(false);
        }
    }, [query, onStateChange]);

    return {
        query,
        setQuery,
        flights,
        setFlights,
        loading,
        searched,
        lastSearchedQuery,
        search
    };
}
