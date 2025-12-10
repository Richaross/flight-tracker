'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useFlightSearch } from '../hooks/useFlightSearch';

/**
 * @typedef {Object} FlightContextType
 * @property {boolean} isSearching - Whether a search has been initiated.
 * @property {boolean} hasResults - Whether the search returned results.
 * @property {boolean} isLoading - Whether data is currently loading (includes minimum wait time).
 * @property {Object|null} selectedFlight - The currently selected flight object.
 * @property {Function} setSelectedFlight - Updates the selected flight.
 * @property {Function} handleSearchStateChange - Callback for search component to update global state.
 * @property {Object} searchState - The object returned by useFlightSearch hooks (internal use mostly).
 */

const FlightContext = createContext(null);

/**
 * Provider component for Flight Tracker state.
 * Wraps the application to provide global access to flight data and UI states.
 */
export function FlightProvider({ children }) {
    const [selectedFlight, setSelectedFlight] = useState(null);
    
    // We lift these states to the context so any component (Sidebar, Map, Penguin) can access them.
    const [isSearching, setIsSearching] = useState(false);
    const [hasResults, setHasResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Updates the global search state. 
     * This is typically called by the FlightSearch component or the useFlightSearch hook.
     */
    const handleSearchStateChange = useCallback((loading, searched, resultsCount) => {
        setIsLoading(loading);
        setIsSearching(searched);
        setHasResults(resultsCount > 0);
        
        // Clear selection if searching starts or if no results found
        if (loading || resultsCount === 0) {
            setSelectedFlight(null);
        }
    }, []);

    const value = useMemo(() => ({
        selectedFlight,
        setSelectedFlight,
        isSearching,
        hasResults,
        isLoading,
        handleSearchStateChange
    }), [selectedFlight, isSearching, hasResults, isLoading, handleSearchStateChange]);

    return (
        <FlightContext.Provider value={value}>
            {children}
        </FlightContext.Provider>
    );
}

/**
 * Hook to consume the FlightContext.
 * @returns {FlightContextType}
 */
export function useFlightContext() {
    const context = useContext(FlightContext);
    if (!context) {
        throw new Error('useFlightContext must be used within a FlightProvider');
    }
    return context;
}
