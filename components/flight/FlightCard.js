import React from 'react';

export default function FlightCard({ flight }) {
    if (!flight) return null;

    return (
        <div className="glass dark:glass-dark rounded-3xl overflow-hidden card-hover slide-down">
            {/* Header / Status Bar */}
            <div className="bg-slate-900/5 dark:bg-white/5 p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {flight.airline.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                            {flight.flightNumber}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide">
                            {flight.airline}
                        </p>
                    </div>
                </div>
                <span
                    className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${flight.status === 'active' || flight.status === 'scheduled'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        }`}
                >
                    {flight.status}
                </span>
            </div>

            {/* Flight Details */}
            <div className="p-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
                    {/* Origin */}
                    <div className="text-center md:text-left flex-1">
                        <p className="text-xs font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-2">
                            Departure
                        </p>
                        <p className="text-5xl font-black text-cyan-600 dark:text-cyan-400 mb-1 tracking-tighter cursor-help" title={flight.originName}>
                            {flight.origin}
                        </p>
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
                            {new Date(flight.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    {/* Center Graphic */}
                    <div className="flex-1 w-full max-w-[200px] flex flex-col items-center justify-center">
                        <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 relative">
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-1">
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                            </div>
                            <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800 rounded-full shadow-sm text-cyan-500">
                                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 font-mono">DIRECT FLIGHT</p>
                    </div>

                    {/* Destination */}
                    <div className="text-center md:text-right flex-1">
                        <p className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-2">
                            Arrival
                        </p>
                        <p className="text-5xl font-black text-violet-600 dark:text-violet-400 mb-1 tracking-tighter cursor-help" title={flight.destinationName}>
                            {flight.destination}
                        </p>
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
                            {new Date(flight.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-white/5 p-4 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">
                    {new Date(flight.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
}
