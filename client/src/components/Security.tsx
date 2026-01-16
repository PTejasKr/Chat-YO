
import React, { useState } from 'react';
import { Shield, Settings as SettingsIcon, ShieldCheck, ChevronLeft } from 'lucide-react';

const Toggle: React.FC<{ active: boolean, onChange: () => void }> = ({ active, onChange }) => (
    <button 
        onClick={onChange}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-white/10'}`}
    >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
);

const Security: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const [rules, setRules] = useState({ phone: true, ip: false, coord: false });

    return (
        <div className="h-full flex flex-col p-8 animate-in slide-in-from-bottom duration-500">
            <header className="flex justify-between items-center mb-12">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40">
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-xs font-bold tracking-[0.4em] uppercase">Privacy Protocols</h2>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 px-1">
                        <Shield size={16} className="text-blue-500" />
                        <h4 className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Redaction Rules</h4>
                    </div>
                    
                    <div className="space-y-3">
                        {[
                            { id: 'phone', label: 'Blur Phone Numbers (5-digit)', sub: 'Automatically redact partial digits in messages' },
                            { id: 'ip', label: 'Convert Address to IP', sub: 'Mask physical locations with network routing' },
                            { id: 'coord', label: 'Auto-Coordinate Location', sub: 'Obfuscate precise GPS coordinates' }
                        ].map(item => (
                            <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex items-center justify-between">
                                <div>
                                    <h5 className="font-bold text-sm tracking-tight mb-1">{item.label}</h5>
                                    <p className="text-[10px] text-white/20">{item.sub}</p>
                                </div>
                                <Toggle active={rules[item.id as keyof typeof rules]} onChange={() => setRules({...rules, [item.id]: !rules[item.id as keyof typeof rules]})} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-3 px-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <h4 className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Session Security</h4>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h5 className="font-bold text-sm tracking-tight">Room TTL (Time-To-Live)</h5>
                            <div className="bg-blue-600/10 border border-blue-600/30 px-3 py-1 rounded-lg text-blue-500 font-mono text-xs">02:00:00</div>
                        </div>
                        <input type="range" className="w-full appearance-none h-1 bg-white/10 rounded-full accent-blue-600" />
                        <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest px-1">
                            <span>30M</span>
                            <span>6H</span>
                            <span>12H</span>
                            <span>24H</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity">
                        <ShieldCheck size={48} />
                    </div>
                    <p className="text-[8px] font-mono tracking-[0.2em] text-white/30 mb-4 uppercase">Encryption Protocol</p>
                    <div className="space-y-1">
                        <p className="text-[10px] text-white/40 uppercase font-mono">Active Standard</p>
                        <h4 className="text-xl font-bold tracking-tight">AES-256-GCM</h4>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 text-[9px] font-mono text-green-500 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>End-to-End Tunnel Verified</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center pb-8">
                <p className="text-[9px] font-mono text-white/10 leading-relaxed uppercase tracking-[0.1em]">
                    All communications are cryptographically signed.<br />Metadata is stripped upon room expiration.
                </p>
            </div>
        </div>
    );
};

export default Security;
