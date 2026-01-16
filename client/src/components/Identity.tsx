import React, { useState, useRef, useEffect } from 'react';
import { Settings as SettingsIcon, RefreshCw, Lock, Pencil, Check } from 'lucide-react';
import { IdentityProfile } from '../types';

interface IdentityProps {
  profile: IdentityProfile;
  setProfile: (p: IdentityProfile) => void;
  onConnect: () => void;
  onSettings: () => void;
}

const Identity: React.FC<IdentityProps> = ({ profile, setProfile, onConnect, onSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(profile.alias);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const regenerate = () => {
    const prefixes = ["Neon", "Ghost", "Cyber", "Void", "Null", "Iron", "Binary"];
    const suffixes = ["Samurai", "Drifter", "Proxy", "Walker", "Zero", "Shadow", "Soul"];
    const newAlias = `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    
    setProfile({
      ...profile,
      alias: newAlias,
      seed: Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => Math.random() > 0.5))
    });
    setEditValue(newAlias);
  };

  const handleSaveAlias = () => {
    const finalAlias = editValue.trim() || profile.alias;
    setProfile({ ...profile, alias: finalAlias });
    setEditValue(finalAlias);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveAlias();
    } else if (e.key === 'Escape') {
      setEditValue(profile.alias);
      setIsEditing(false);
    }
  };

  return (
    <div 
        className="h-full flex flex-col bg-black text-white p-8 animate-in fade-in duration-700 overflow-y-auto no-scrollbar"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="w-12 h-12" /> {/* Spacer */}
        <h2 className="text-[11px] tracking-[0.6em] font-mono font-bold uppercase text-white/60">CHATYO</h2>
        <button 
          onClick={onSettings}
          className="w-12 h-12 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      {/* Visual Signature Section */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 mb-6">
        <div className="relative group">
          <div className="w-64 h-64 bg-[#0A0A0A] border border-white/5 rounded-[56px] p-12 grid overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105"
            style={{ 
              gridTemplateColumns: `repeat(5, 1fr)`,
              gridTemplateRows: `repeat(5, 1fr)`,
              gap: '12px'
            }}
          >
            {Array.from({ length: 25 }).map((_, i) => {
              const r = Math.floor(i / 5);
              const c = i % 5;
              const seedR = Math.floor((r / 5) * 32);
              const seedC = Math.floor((c / 5) * 32);
              const active = profile.seed[seedR][seedC];
              return (
                <div 
                  key={i} 
                  className={`w-full h-full rounded-[4px] transition-all duration-700`}
                  style={{ backgroundColor: active ? profile.color : 'rgba(255,255,255,0.1)' }} 
                />
              );
            })}
          </div>
          <div className="absolute inset-0 -m-8 border border-white/[0.03] rounded-full pointer-events-none" />
          <div className="absolute inset-0 -m-16 border border-white/[0.01] rounded-full pointer-events-none" />
        </div>

        {/* Alias Section */}
        <div className="text-center space-y-4 w-full max-w-sm px-4">
          <div className="space-y-1">
             <label className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase font-bold block">Active Session Alias</label>
             <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Visibility: Public to Node</p>
          </div>
          
          <div className="relative group">
            <div className={`flex items-center justify-center space-x-3 transition-all duration-300 ${isEditing ? 'scale-105' : ''}`}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={18}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveAlias}
                  className="text-4xl font-black tracking-tight text-white uppercase bg-[#0A0A0A] border-b-2 border-white/20 outline-none text-center w-full focus:border-white focus:ring-0 px-2 py-1 rounded-t-lg"
                />
              ) : (
                <h1 
                  onClick={() => setIsEditing(true)}
                  className="text-4xl font-black tracking-tight text-white uppercase truncate max-w-full cursor-text hover:text-white/80 transition-colors"
                >
                  {profile.alias}
                </h1>
              )}
              <button 
                onClick={() => isEditing ? handleSaveAlias() : setIsEditing(true)}
                className={`transition-colors shrink-0 p-2 rounded-full ${isEditing ? 'text-green-500 bg-green-500/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
              >
                {isEditing ? <Check size={24} /> : <Pencil size={24} />}
              </button>
            </div>
            <div className={`h-[1px] w-full mt-4 transition-all duration-500 ${isEditing ? 'bg-white scale-x-110' : 'bg-white/10'}`} />
          </div>
          
          <button 
            onClick={regenerate}
            className="flex items-center space-x-3 mx-auto pt-8 text-white/30 hover:text-white transition-colors group"
          >
            <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold">Regenerate Digital Soul</span>
          </button>
        </div>
      </div>

      {/* Protocol Cards - Increased spacing above them as requested */}
      <div className="grid grid-cols-2 gap-4 mb-10 pt-12">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 space-y-3">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest font-bold">Encryption</p>
          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
            <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-widest">AES-256</span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 space-y-3">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest font-bold">Protocol</p>
          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-center">
            <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-widest">Tor-Mesh</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-6 pb-4">
        <button 
          onClick={onConnect}
          className="w-full h-20 bg-[#A1A7B2] text-black rounded-[32px] flex items-center justify-center space-x-4 font-bold text-lg tracking-[0.2em] uppercase transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(161,167,178,0.25)] hover:brightness-110"
        >
          <Lock size={24} fill="currentColor" />
          <span>Commit & Join Void</span>
        </button>
        
        <div className="flex items-center justify-center space-x-3">
          <div className="w-2.5 h-2.5 bg-white/20 rounded-full border border-white/40 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          </div>
          <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase font-bold">System Status: Nominal</p>
        </div>
      </div>
    </div>
  );
};

export default Identity;