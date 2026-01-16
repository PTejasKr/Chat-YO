import React from 'react';
import { ChevronLeft, ChevronRight, Shield, Grid, MessageSquare, Users, Settings as GearIcon, User } from 'lucide-react';
import { Screen } from '../types';

interface SettingsProps {
  onBack: () => void;
  onPrivacy: () => void;
  onProfile: () => void;
  onNavChange: (s: Screen) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onPrivacy, onProfile, onNavChange }) => {
  return (
    <div className="h-full flex flex-col bg-black text-white animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col items-center p-8 pb-4 relative">
        <button 
          onClick={onBack}
          className="absolute left-6 top-8 w-10 h-10 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 font-bold uppercase mb-8">CHATYO</span>
        
        <div className="w-full pt-10 px-2 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white/90">Vault</h1>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mt-2">Security & Identity Hub</p>
        </div>
      </header>

      {/* Settings Cards */}
      <div className="flex-1 px-8 space-y-4 pt-4">
        <button 
          onClick={onPrivacy}
          className="w-full bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 flex items-center space-x-5 group transition-all hover:bg-white/[0.03] active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
            <Shield size={24} fill="currentColor" fillOpacity={0.1} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold tracking-tight text-white/90">Privacy Protocols</h3>
            <p className="text-[12px] text-white/40 leading-tight">Manage encryption & redaction rules</p>
          </div>
          <ChevronRight size={20} className="text-white/10 group-hover:text-white/40 transition-all" />
        </button>

        <button 
          onClick={onProfile}
          className="w-full bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 flex items-center space-x-5 group transition-all hover:bg-white/[0.03] active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
            <User size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold tracking-tight text-white/90">Alias & Signature</h3>
            <p className="text-[12px] text-white/40 leading-tight">Customize your digital identity</p>
          </div>
          <ChevronRight size={20} className="text-white/10 group-hover:text-white/40 transition-all" />
        </button>
      </div>

      {/* Bottom Nav provided in App.tsx via BottomNav.tsx */}
    </div>
  );
};

export default Settings;