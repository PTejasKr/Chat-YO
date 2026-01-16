
import React, { useEffect, useState } from 'react';
import { RefreshCw, User, Shield } from 'lucide-react';
import { IdentityProfile } from '../types';

interface HandshakeProps {
  profile: IdentityProfile;
  onComplete: () => void;
  onFailure: () => void;
}

const Handshake: React.FC<HandshakeProps> = ({ profile, onComplete, onFailure }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (Math.random() > 0.1) onComplete(); else onFailure();
          }, 800);
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 300);
    return () => clearInterval(timer);
  }, [onComplete, onFailure]);

  const renderSignature = (size = 200) => {
    const densityValues = [2, 4, 8, 16, 32];
    const density = densityValues[profile.density];
    
    return (
      <div 
        className="rounded-[40px] overflow-hidden grid bg-[#0A0A0A] border border-white/10 shadow-2xl relative"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          gridTemplateColumns: `repeat(${density}, 1fr)`,
          gridTemplateRows: `repeat(${density}, 1fr)`,
          gap: '1px',
          padding: '24px'
        }}
      >
        {Array.from({ length: density * density }).map((_, i) => {
          const r = Math.floor(i / density);
          const c = i % density;
          const seedR = Math.floor((r / density) * 32);
          const seedC = Math.floor((c / density) * 32);
          const isActive = profile.seed[seedR][seedC];
          return (
            <div 
              key={i} 
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: isActive ? profile.color : 'transparent' }} 
            />
          );
        })}
        {/* Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-black relative flex flex-col items-center justify-center overflow-hidden p-8">
      {/* Background Vertical Grid Lines */}
      <div className="absolute inset-0 flex justify-center space-x-12 opacity-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-white" />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-12 w-full max-w-xs">
        <p className="text-[10px] tracking-[0.6em] font-mono text-white/30 uppercase font-bold animate-pulse">Establishing Link</p>
        
        {/* User Visual Signature */}
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            {renderSignature(220)}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <Shield size={28} className="text-white/40" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{profile.alias}</h1>
            <p className="text-[10px] font-mono text-white/20 tracking-[0.4em] uppercase font-bold">Node Identity Verified</p>
          </div>
        </div>

        <div className="flex justify-center py-4">
            <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-20" />
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    <RefreshCw size={20} className="text-white/40 animate-spin" />
                </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-8 right-8 space-y-4">
        <div className="flex justify-between text-[10px] font-mono tracking-widest px-2 font-bold">
            <span className="text-white/20 uppercase">Syncing Buffer...</span>
            <span className="text-white/40 uppercase">{progress}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
        </div>
      </div>

      <style>{`
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Handshake;
