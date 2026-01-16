import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Plus, ArrowRight, MessageSquare } from 'lucide-react';
import { Room } from '../types';

const RoomTTL: React.FC<{ startTime: number, ttl: number }> = ({ startTime, ttl }) => {
    const calculateTimeLeft = useCallback(() => {
        const expiryTime = startTime + ttl * 60 * 1000;
        const timeLeftInSeconds = Math.max(0, (expiryTime - Date.now()) / 1000);
        return timeLeftInSeconds;
    }, [startTime, ttl]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const formatTime = (seconds: number) => {
        if (seconds <= 0) return '00:00:00';
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const totalDuration = ttl * 60;
    const percentageLeft = (timeLeft / totalDuration) * 100;
    
    let colorClass = 'text-white/40';
    if (timeLeft <= 60) {
        colorClass = 'text-red-500 animate-pulse-timer font-bold';
    } else if (timeLeft <= 300) {
        colorClass = 'text-yellow-500 font-bold';
    }

    return (
        <div className={`flex items-center space-x-2 transition-colors ${colorClass}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className={`text-xs font-mono tracking-widest`}>
                TTL: {formatTime(timeLeft)}
            </span>
        </div>
    );
};

const Dashboard: React.FC<{
    rooms: Room[];
    onSelectRoom: (id: string) => void;
    onCreateRoom: () => void;
    onGoToSettings: () => void;
}> = ({ rooms, onSelectRoom, onCreateRoom, onGoToSettings }) => {

    return (
        <div className="h-full flex flex-col bg-transparent text-white animate-in fade-in duration-500 relative">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
                <header 
                    className="flex justify-between items-center p-8 sticky top-0 bg-black/80 backdrop-blur-md z-30 border-b border-white/[0.02]"
                    style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
                >
                    <div className="w-14 h-14" />
                    <h2 className="text-[11px] tracking-[0.5em] font-mono font-bold uppercase text-white/60">Network Hub</h2>
                    <button onClick={onGoToSettings} className="w-14 h-14 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <Settings size={24} />
                    </button>
                </header>

                <div className="px-8 py-8 space-y-12">
                    {/* Active Enclaves Section */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-black tracking-[0.2em] text-white/60 uppercase px-2">Active Enclaves</h3>
                        {rooms.length > 0 ? (
                            <div className="space-y-4">
                                {rooms.map(room => (
                                    <button key={room.id} onClick={() => onSelectRoom(room.id)} className="w-full glass-panel rounded-[32px] p-6 flex items-center justify-between group transition-all active:scale-95 hover:bg-white/[0.05]">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center"><MessageSquare size={24}/></div>
                                            <div className="text-left">
                                                <h4 className="font-bold uppercase tracking-wide">{room.name}</h4>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <p className="text-xs text-white/40">{room.type === 'OWNED' ? 'Owner' : 'Member'}</p>
                                                    <RoomTTL startTime={room.startTime} ttl={room.ttl} />
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight size={20} className="text-white/20 group-hover:translate-x-1 transition-transform"/>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <p className="text-xs font-mono text-white/30 tracking-widest">NO ACTIVE ENCLAVES</p>
                            </div>
                        )}
                    </section>

                    <button
                        onClick={onCreateRoom}
                        className="w-full h-24 bg-[#A1A7B2] text-black rounded-[40px] flex items-center justify-center space-x-4 font-black text-lg tracking-[0.3em] uppercase transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(161,167,178,0.25)] group"
                    >
                        <Plus size={24} strokeWidth={4} />
                        <span>Create Enclave</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;