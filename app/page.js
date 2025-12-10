'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import FlightAttendant from '../components/FlightAttendant';
import Sidebar from '../components/layout/Sidebar';
import WelcomeScreen from '../components/layout/WelcomeScreen';

// Dynamic import for Map to avoid SSR issues
const FlightMap = dynamic(() => import('../components/FlightMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 dark:bg-slate-900 animate-pulse" />
});

export default function Home() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // App State Lifted to Page Level
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFlightSelect = (flight) => {
      setSelectedFlight(flight);
      if (flight) setHasResults(true);
  };
  
  const handleSearchStateChange = (loading, searched, resultsCount) => {
      setIsLoading(loading);
      setIsSearching(searched);
      setHasResults(resultsCount > 0);
      if (resultsCount === 0) setSelectedFlight(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}

      {/* Layer 1: Full Screen Map Background */}
      <div className="absolute inset-0 z-0">
        <FlightMap flight={selectedFlight} />
      </div>

      {/* Layer 1.5: Flight Attendant Penguin (Overlay on Map when idle/loading/error) */}
      <FlightAttendant loading={isLoading} searched={isSearching} hasResults={hasResults} />

      {/* Layer 2: Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-900/10 via-transparent to-transparent z-0"></div>

      {/* Layer 3: Floating Dashboard / Sidebar */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none z-10 flex flex-col md:flex-row p-4 md:p-6 gap-6">
        <Sidebar 
            selectedFlight={selectedFlight}
            isSearching={isSearching}
            hasResults={hasResults}
            isLoading={isLoading}
            onFlightSelect={handleFlightSelect}
            onSearchStateChange={handleSearchStateChange}
        />
      </div>
    </main>
  );
}
