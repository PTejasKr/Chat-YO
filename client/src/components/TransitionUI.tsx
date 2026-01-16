
import React, { useEffect, useState } from 'react';
import { Zap, Shield, Cpu, Wifi } from 'lucide-react';

interface TransitionUIProps {
  onComplete: () => void;
}

const TransitionUI: React.FC<TransitionUIProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const systemLogs = [
    "ALLOCATING_VOID_BUFFER...",
    "ISOLATING_EPHEMERAL_NODE...",
    "GENERATING_ASYMMETRIC_KEYS...",
    "SYNCING_WITH_TOR_NETWORK...",
    "REDACTING_LOCAL_METADATA...",
    "PROTOCOL_INIT_SUCCESSFUL."
  ];

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 8) + 2;
      });
    }, 100);

    // Log streaming animation
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < systemLogs.length) {
        setLogs(prev => [...prev, systemLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        // Delay completion slightly after the last log for aesthetic weight
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center p-12 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Central Radar/Pulse Element */}
      <div className="relative mb-20">
        <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative">
          <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-[-20px] border border-white/5 rounded-full" />
          <div className="absolute inset-[-40px] border border-white/[0.02] rounded-full" />
          
          {/* Pulsing Core */}
          <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center relative overflow-hidden">
            <Zap size={32} className="text-white/40 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-[scan_2s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Identity Label */}
      <div className="text-center space-y-3 mb-16 relative z-10">
        <h2 className="text-[11px] tracking-[0.6em] font-mono font-bold uppercase text-white/40">Initializing Protocol</h2>
        <div className="flex items-center justify-center space-x-3">
          <Shield size={16} className="text-white/20" />
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Signal Propagation</h1>
        </div>
      </div>

      {/* Progress and Logs Section */}
      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Progress Container */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <span className="text-[9px] font-mono tracking-widest text-white/20 uppercase font-bold">Secure_Buffer</span>
            <span className="text-[11px] font-mono text-white/60 font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05]">
            <div 
              className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-[#050505] border border-white/5 rounded-[32px] p-8 min-h-[160px] flex flex-col justify-end">
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center space-x-3 animate-in slide-in-from-left-2 fade-in duration-300">
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <p className={`text-[9px] font-mono tracking-wider uppercase ${i === logs.length - 1 ? 'text-white' : 'text-white/20'}`}>
                  {log}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-16 flex items-center space-x-8 opacity-20">
        <div className="flex items-center space-x-2">
          <Cpu size={12} />
          <span className="text-[8px] font-mono uppercase font-bold tracking-widest">Mem_Isolation</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wifi size={12} />
          <span className="text-[8px] font-mono uppercase font-bold tracking-widest">Network_Mesh</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(100%); }
          to { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
};

export default TransitionUI;
