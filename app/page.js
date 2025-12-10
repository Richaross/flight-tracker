'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import FlightAttendant from '../components/FlightAttendant';
import Sidebar from '../components/layout/Sidebar';
import WelcomeScreen from '../components/layout/WelcomeScreen';
import { FlightProvider, useFlightContext } from '../lib/context/FlightContext';

// Dynamic import for Map to avoid SSR issues
const FlightMap = dynamic(() => import('../components/FlightMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 dark:bg-slate-900 animate-pulse" />
});

function FlightTrackerContent() {
    const { selectedFlight, isLoading, isSearching, hasResults } = useFlightContext();
    const [showWelcome, setShowWelcome] = useState(true);

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
            <Sidebar />
          </div>
        </main>
    );
}

export default function Home() {
  return (
      <FlightProvider>
          <FlightTrackerContent />
      </FlightProvider>
  );
}
