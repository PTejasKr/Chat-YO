import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Reticulating splines...",
    "Calibrating quantum flux...",
    "Shrouding IP with void-matter...",
    "Defragmenting ephemeral consciousness...",
    "Initializing ghost protocol...",
    "Bypassing mainframe security...",
    "Warming up the reality distortion field..."
];

const Entrance: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(loadingMessages[0]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const progressTimer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(progressTimer);
                    setIsComplete(true);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return p + 1;
            });
        }, 40);

        let msgIndex = 0;
        const messageTimer = setInterval(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            setMessage(loadingMessages[msgIndex]);
        }, 1200);

        return () => {
            clearInterval(progressTimer);
            clearInterval(messageTimer);
        };
    }, [onComplete]);

    return (
        <div className={`h-full w-full bg-black flex flex-col items-center justify-center p-8 transition-opacity duration-700 relative overflow-hidden ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
            <div className="particle-bg" />
            
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 relative z-10">
                <div className="glitch-wrapper">
                    <h1 className="glitch text-7xl md:text-8xl font-black uppercase tracking-widest" data-text="CHATYO">CHATYO</h1>
                </div>
                <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase font-bold">
                    Zero Trace Gateway
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4 relative z-10">
                <p className="text-[9px] font-mono text-white/20 tracking-widest text-center animate-pulse">
                    {message}
                </p>
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-white shadow-[0_0_10px_white,0_0_20px_rgba(161,167,178,0.5)] transition-all duration-200 progress-bar-animated"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Entrance;