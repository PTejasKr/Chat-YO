import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { IdentityProfile } from '../types';
import FlipDigit from './FlipDigit';

interface ScannerProps {
  profile: IdentityProfile;
  onScanComplete: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ profile, onScanComplete }) => {
  const [range, setRange] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onScanComplete();
    }, 4000); // simulate 4s scan time
  };
  
  const renderSignature = (size = 120) => {
    const densityValues = [2, 4, 8, 16, 32];
    const density = densityValues[profile.density];
    
    return (
      <div 
        className="rounded-full overflow-hidden grid bg-[#0A0A0A] border-2 border-white/10 shadow-2xl relative transition-all"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          gridTemplateColumns: `repeat(${density}, 1fr)`,
          gridTemplateRows: `repeat(${density}, 1fr)`,
          gap: '1px',
          padding: '16px',
          borderColor: isScanning ? 'rgba(161, 167, 178, 0.5)' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isScanning ? '0 0 30px rgba(161, 167, 178, 0.3)' : 'none'
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
      </div>
    );
  };

  const rangeMain = Math.floor(range).toString().padStart(2, '0');
  const rangeDec = Math.round((range % 1) * 10).toString();

  return (
    <div className="h-full flex flex-col items-center justify-between bg-black text-white p-8 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Header */}
      <header className="text-center w-full z-10">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white/90">Proximity Scan</h2>
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">Search for open enclaves</p>
      </header>

      {/* Sonar Visual */}
      <div className="relative w-full aspect-square max-w-sm flex items-center justify-center">
        {/* Static Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20% 20%' }} />
        
        {/* Sonar Rings */}
        <div className={`absolute w-full h-full rounded-full border border-white/10 ${isScanning ? 'animate-sonar-pulse-fast' : 'animate-sonar-pulse'}`} />
        <div className={`absolute w-2/3 h-2/3 rounded-full border border-white/5 ${isScanning ? 'animate-sonar-pulse-fast' : 'animate-sonar-pulse'}`} style={{ animationDelay: '0.5s' }} />
        <div className={`absolute w-1/3 h-1/3 rounded-full border border-white/5 ${isScanning ? 'animate-sonar-pulse-fast' : 'animate-sonar-pulse'}`} style={{ animationDelay: '1s' }} />
        
        {/* Sweep Animation */}
        <div className={`absolute w-full h-full ${isScanning ? 'animate-sonar-sweep' : ''}`}>
          <div className="w-full h-full bg-gradient-to-t from-transparent to-gray-500/20 rounded-full" />
        </div>
        
        {/* Centerpiece */}
        <div className="relative z-10">
          {renderSignature()}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-mono tracking-wider text-white/40 uppercase">Range</h3>
            <div className="flex items-baseline space-x-1">
              <FlipDigit value={rangeMain} size="md" color={isScanning ? '#A1A7B2' : '#FFFFFF'} />
              <span className="text-2xl font-mono text-white/20">.</span>
              <FlipDigit value={rangeDec} label="KM" size="md" color={isScanning ? '#A1A7B2' : '#FFFFFF'} />
            </div>
          </div>
          <input 
            type="range" 
            min="0" max="20" step="0.5" 
            value={range}
            onChange={(e) => setRange(parseFloat(e.target.value))}
            disabled={isScanning}
            className="w-full h-2 bg-white/5 rounded-full appearance-none accent-gray-400 cursor-pointer disabled:opacity-30"
          />
        </div>
        
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full h-20 bg-white text-black rounded-[28px] flex items-center justify-center space-x-4 font-bold text-lg tracking-[0.3em] uppercase transition-all active:scale-[0.98] shadow-2xl disabled:opacity-50 group overflow-hidden relative"
        >
          {isScanning ? (
            <>
              <div className="absolute inset-0 bg-gray-500/20 animate-pulse" />
              <Radio size={24} className="animate-ping" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Radio size={24} />
              <span>Begin Scan</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes sonar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-sonar-sweep {
          animation: sonar-sweep 2.5s linear infinite;
        }
        @keyframes sonar-pulse {
          0% { transform: scale(0.1); opacity: 0; }
          50% { opacity: 0.2; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-sonar-pulse {
          animation: sonar-pulse 2s infinite ease-out;
        }
        .animate-sonar-pulse-fast {
          animation: sonar-pulse 1s infinite ease-out;
        }
      `}</style>
    </div>
  );
};

export default Scanner;