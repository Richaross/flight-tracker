'use client';

import { useEffect } from 'react';
import { useFlightSearch } from '../lib/hooks/useFlightSearch';
import { useFlightContext } from '../lib/context/FlightContext';
import FlightCard from './flight/FlightCard';

export default function FlightSearch() {
  const { handleSearchStateChange, setSelectedFlight } = useFlightContext();
  
  const { 
    query, 
    setQuery, 
    flights, 
    loading, 
    searched, 
    lastSearchedQuery, 
    search 
  } = useFlightSearch(handleSearchStateChange);

  // Sync flight selection with parent (via Context)
  useEffect(() => {
    if (searched) {
        if (flights.length > 0) {
            setSelectedFlight(flights[0]);
        } else {
            setSelectedFlight(null);
        }
    }
  }, [flights, searched, setSelectedFlight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search flight number (e.g., AA123)"
          className="w-full p-3 pl-12 pr-28 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-lg text-sm font-medium placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/40 active:scale-95 flex items-center justify-center text-sm"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'TRACK'
          )}
        </button>
      </form>

      <div className="space-y-6">
        {searched && flights.length === 0 && !loading && (
          <div className="glass p-8 rounded-2xl text-center border-l-4 border-l-red-500">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No flights found for "<span className="font-semibold text-slate-900 dark:text-white">{lastSearchedQuery}</span>"
            </p>
          </div>
        )}

        {flights.map((flight) => (
          <FlightCard key={flight.flightNumber} flight={flight} />
        ))}
      </div>
    </div>
  );
}
