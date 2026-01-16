
import React, { useState } from 'react';
import { Skull, ShieldAlert, X, ShieldCheck } from 'lucide-react';

const Panic: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [tapCount, setTapCount] = useState(0);

  const handleKillPress = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 3) {
      onConfirm();
    }
  };

  return (
    <div className="h-full bg-black p-8 flex flex-col animate-in fade-in duration-500 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      
      {/* Header with Exit Button */}
      <header className="flex justify-between items-center mb-16 relative z-10 px-4">
        <button 
          onClick={onCancel}
          className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          title="Abort Protocol"
        >
          <X size={28} />
        </button>
        <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-white/60">Panic Protocol</h2>
        <ShieldCheck size={24} className="text-white/40" />
      </header>

      {/* Main Content */}
      <div className="text-center space-y-6 relative z-10">
        <h1 className="text-[48px] font-black tracking-tighter leading-[0.9] uppercase flex flex-col">
          <span className="blur-[0.5px]">Activate</span>
          <span className="text-red-600">Instant</span>
          <span className="blur-[0.5px]">Wipe?</span>
        </h1>
        <div className="flex items-center justify-center space-x-3">
            <ShieldAlert size={14} className="text-red-600 animate-pulse" />
            <p className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase font-black">Critical Alert Status</p>
        </div>
      </div>

      {/* Kill Button with Triple Tap Logic */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-12">
        <div className="relative group">
          {/* Progress Ring / Visual Feedback */}
          <div className="absolute inset-0 -m-8 rounded-full border border-red-600/10 animate-ping opacity-20" />
          <svg className="absolute inset-0 -m-6 w-[calc(100%+48px)] h-[calc(100%+48px)] -rotate-90">
            <circle
              cx="50%" cy="50%" r="48%"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="2"
            />
            <circle
              cx="50%" cy="50%" r="48%"
              fill="none"
              stroke="#EF4444"
              strokeWidth="6"
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              style={{ 
                strokeDasharray: '452.39', 
                strokeDashoffset: (452.39 - (tapCount * 150.79)).toString() 
              }}
            />
          </svg>

          <button 
            onClick={handleKillPress}
            className={`
                w-64 h-64 rounded-full flex flex-col items-center justify-center space-y-4 
                transition-all duration-150 relative z-10 border-[12px] border-black shadow-2xl
                ${tapCount === 0 
                    ? 'bg-[#B2B6BF] text-black active:scale-95' 
                    : tapCount === 1 
                        ? 'bg-red-500 text-white scale-105 shadow-[0_0_50px_rgba(239,68,68,0.3)]' 
                        : 'bg-red-700 text-white scale-110 shadow-[0_0_80px_rgba(239,68,68,0.5)] animate-pulse'
                }
            `}
          >
            <Skull size={84} />
            <span className="text-3xl font-black tracking-[0.3em] uppercase">Kill</span>
          </button>
        </div>
        
        <div className="mt-12 space-y-2 text-center">
            <div className="flex justify-center space-x-2">
                {[1, 2, 3].map(i => (
                    <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${tapCount >= i ? 'bg-red-500 scale-125' : 'bg-white/10'}`} 
                    />
                ))}
            </div>
            <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.3em]">
              {tapCount === 0 ? 'Press Thrice to Purge' : tapCount === 1 ? 'Two Taps Remaining' : 'Final Tap to Zero'}
            </p>
        </div>
      </div>

      {/* Checklist (Disabled UI items to show impact) */}
      <div className="space-y-6 mb-12 relative z-10 bg-white/[0.02] border border-white/5 p-6 rounded-[32px]">
        <h4 className="text-[9px] font-mono tracking-[0.3em] text-white/20 uppercase text-center border-b border-white/5 pb-4">Erasure Manifest</h4>
        <div className="grid grid-cols-2 gap-4">
            {[
                { label: 'Keys', status: 'VOLATILE' },
                { label: 'Logs', status: 'NON-RESTORE' },
                { label: 'Alias', status: 'UNLINK' },
                { label: 'Node', status: 'DROP' }
            ].map((item, i) => (
                <div key={i} className="space-y-1">
                    <p className="text-[10px] font-bold tracking-tight text-white/70 uppercase">{item.label}</p>
                    <p className="text-[8px] font-mono text-red-600/60 uppercase tracking-widest font-black">[{item.status}]</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Panic;
