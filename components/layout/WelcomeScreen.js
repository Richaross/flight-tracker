import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomeScreen({ onComplete }) {
    const [bgVisible, setBgVisible] = useState(true);
    const [contentVisible, setContentVisible] = useState(true);

    useEffect(() => {
        // Timeline:
        // 0ms: Start
        // 2000ms: Fade out text/content
        // 2500ms: Fade out solid turquoise background
        // 3000ms: Complete (unmount)
        
        const contentTimer = setTimeout(() => {
            setContentVisible(false); // Fade out logo/text
        }, 2000);

        const bgTimer = setTimeout(() => {
            setBgVisible(false); // Fade out background
        }, 2600); // 2000 + 600ms for content fade

        const finishTimer = setTimeout(onComplete, 3200); // 2600 + 600ms for bg fade

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(bgTimer);
            clearTimeout(finishTimer);
        };
    }, [onComplete]);

    return (
        <div 
            className={`fixed inset-0 z-[1000] bg-cyan-500 flex items-center justify-center transition-opacity duration-700 ease-in-out ${bgVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className={`text-center text-white p-10 transition-opacity duration-500 ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 animate-bounce-slow">
                    Welcome to<br/>FlightTracker
                 </h1>
                 <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mt-8"></div>
            </div>
            {/* Eventual background image code */}
            {/* <div className={`absolute inset-0 -z-10 opacity-20 transition-opacity duration-500 ${contentVisible ? 'opacity-20' : 'opacity-0'}`}>
                <Image src="/welcome-screen.png" alt="" fill className="object-cover" />
            </div> */}
        </div>
    );
}
