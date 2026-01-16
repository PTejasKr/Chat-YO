import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import FlipDigit from './FlipDigit';

const Termination: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const wipeSteps = [
    ">> INITIATING_WIPE_SEQUENCE...",
    ">> OVERWRITING_MEMORY_BLOCKS_0xFF1A...",
    ">> ENCRYPTION_KEYS_DESTROYED...",
    ">> LOCAL_DB_SCRUBBED...",
    ">> SERVER_TTL_EXPIRED...",
    ">> CLEAN."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < wipeSteps.length) {
        setLogs(prev => [...prev, wipeSteps[i]]);
        i++;
      } else clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-black relative flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="scan-line opacity-20" />
      
      <header className="absolute top-12 left-8 right-8 flex justify-between items-start font-mono text-[8px] tracking-[0.2em] text-white/20">
          <div className="space-y-1">
              <p>LOC: 127.0.0.1</p>
              <p>NODE: CY_01</p>
              <p>SYSTEM_PURGE_v4.2</p>
          </div>
          <div className="text-right space-y-1">
              <p className="text-red-500 font-bold uppercase">SECURE_ERASE</p>
              <p className="uppercase">NON-RECOVERABLE</p>
              <div className="flex justify-end pt-1"><RefreshCw size={10} className="animate-spin" /></div>
          </div>
      </header>

      <div className="relative mb-16">
          <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative">
              <div className="absolute inset-0 border border-white/5 rounded-full scale-110" />
              <div className="absolute inset-0 border border-white/5 rounded-full scale-125" />
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <RefreshCw size={32} className="text-white/20" />
              </div>
          </div>
      </div>

      <div className="flex space-x-3 mb-12 items-center">
          <FlipDigit value="00" label="hours" />
          <span className="text-white/10 mb-6 font-bold">:</span>
          <FlipDigit value="00" label="minutes" />
          <span className="text-white/10 mb-6 font-bold">:</span>
          <FlipDigit value="00" label="seconds" />
      </div>

      <div className="text-center mb-12 space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-widest leading-none text-white">Session Terminated:</h1>
          <h2 className="text-3xl font-black uppercase tracking-widest text-[#A1A7B2] animate-pulse">Void Reached</h2>
      </div>

      <div className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-3 font-mono text-[9px] leading-relaxed mb-12">
          {logs.map((log, i) => (
              <p key={i} className={`${log.includes('DESTROYED') ? 'text-[#A1A7B2]' : log.includes('CLEAN') ? 'text-white font-bold' : 'text-white/30'}`}>
                {log}
              </p>
          ))}
      </div>

      <button 
        onClick={onReset}
        className="w-full h-20 bg-[#A1A7B2] text-black rounded-[28px] font-bold text-base tracking-[0.3em] uppercase transition-all active:scale-95 shadow-[0_0_40px_rgba(161,167,178,0.4)]"
      >
        Return to Void
      </button>

      <footer className="mt-8 text-[9px] font-mono tracking-[0.3em] text-white/10 uppercase">Identity Reset Protocol v2.0</footer>
    </div>
  );
};

export default Termination;