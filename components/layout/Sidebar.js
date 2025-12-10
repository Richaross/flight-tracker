'use client';

import React from 'react';
import FlightSearch from '../FlightSearch';
import { useFlightContext } from '../../lib/context/FlightContext';

// Option A: Living Header Logic
const getHeaderContent = (loading, searching, hasResults) => {
    let title = "FlightTracker";
    let subtitle = "Real-time global flight tracking. Enter a flight number below to visualize the journey.";

    if (loading) {
        subtitle = "Looking for your flight... Wait a moment...";
    } else if (searching && !hasResults) {
        title = "Oops!";
        subtitle = "The flight hasn't been found. Please check the number.";
    } else if (!searching && !hasResults) {
        subtitle = "At your service! Give me a flight number to start.";
    }

    return { title, subtitle };
};

export default function Sidebar() {
    const { selectedFlight, isSearching, hasResults, isLoading } = useFlightContext();
    const { title, subtitle } = getHeaderContent(isLoading, isSearching, hasResults);

    return (
        <aside className="pointer-events-auto w-full md:max-w-md lg:max-w-lg h-fit max-h-full overflow-y-auto custom-scrollbar flex flex-col gap-6">

            {/* Header Card (Living Header) */}
            <div className="glass dark:glass-dark p-6 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/40">
                <header className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-600 dark:from-white dark:to-cyan-200">
                            {title}
                        </h1>
                    </div>
                </header>
                <p className={`text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2 ${isLoading ? 'animate-pulse text-cyan-600 dark:text-cyan-400 font-medium' : ''}`}>
                    {subtitle}
                </p>
            </div>

            {/* Search & Results Panel */}
            <div className="glass dark:glass-dark p-6 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/40 min-h-[200px]">
                <FlightSearch />
            </div>

            {/* Quick Stats / Info */}
            {!selectedFlight && !isSearching && !hasResults && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass dark:glass-dark p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-slate-800 dark:text-white mb-1">24/7</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Live Tracking</span>
                    </div>
                    <div className="glass dark:glass-dark p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-slate-800 dark:text-white mb-1">Global</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Coverage</span>
                    </div>
                </div>
            )}
        </aside>
    );
}
