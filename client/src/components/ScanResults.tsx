import React, { useState } from 'react';
import { ChevronLeft, Radio, ArrowRight, Shield, Zap, Users, LockOpen, Wifi, Send, Check } from 'lucide-react';
import { NEARBY_NODES, NEARBY_GROUPS } from '../constants';

interface ScanResultsProps {
  onBack: () => void;
  onJoinRoom: (name: string, code: string) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ onBack, onJoinRoom }) => {
  const [pingedNodes, setPingedNodes] = useState<Set<string>>(new Set());

  const handlePing = (id: string) => {
    setPingedNodes(prev => new Set(prev).add(id));
    setTimeout(() => {
      setPingedNodes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-black text-white animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-36">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-black/90 backdrop-blur-md z-30">
        <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/60 font-mono">Discovered Entities</h2>
            <p className="text-[8px] font-mono text-green-500 mt-1 uppercase tracking-widest flex items-center justify-center">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                Live Feed Active
            </p>
        </div>
        <div className="w-10" />
      </header>

      <div className="px-6 py-8 space-y-10">
        {/* Radar Background Visual */}
        <div className="relative h-1 bg-white/[0.02] rounded-full overflow-hidden mb-6">
            <div className="absolute inset-0 bg-blue-500/40 w-1/4 animate-[scan_2.5s_infinite_linear]" />
        </div>

        {/* Proximity Enclaves Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <Radio size={14} className="text-blue-500 animate-pulse" />
              <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/40 font-bold uppercase">Proximity Enclaves</h3>
            </div>
            <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Broadcast Open</span>
          </div>

          <div className="space-y-4">
            {/* OMEGA-ZERO Card - High Intensity */}
            <button 
              onClick={() => onJoinRoom("OMEGA-ZERO", "PROXIMITY_AUTH")}
              className="w-full bg-blue-600/5 border border-blue-500/20 rounded-[40px] p-8 flex items-center justify-between group transition-all hover:bg-blue-600/10 active:scale-[0.98] relative overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-500"
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] scale-150 rotate-12">
                <Radio size={80} />
              </div>
              <div className="flex items-center space-x-6 relative z-10">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                  <div className="relative">
                    <Radio size={28} />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <h4 className="text-xl font-black tracking-tight text-white uppercase">OMEGA-ZERO</h4>
                  <div className="flex items-center space-x-4 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <span className="text-blue-400">Range: 0.2 KM</span>
                    <div className="w-[1px] h-3 bg-blue-500/20" />
                    <span className="text-blue-400/60 font-black">Join Authorized</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                <ArrowRight size={24} />
              </div>
            </button>
          </div>
        </section>

        {/* Cipher Enclaves Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <Zap size={14} className="text-white/40" />
              <h3 className="text-[10px] font-mono tracking-[0.3em] text-white/40 font-bold uppercase">Cipher Enclaves</h3>
            </div>
            <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">[{NEARBY_GROUPS.length}_TOTAL]</span>
          </div>
          
          <div className="space-y-4">
            {NEARBY_GROUPS.map((group, index) => (
              <button 
                key={group.id}
                onClick={() => onJoinRoom(group.name, 'AUTO_JUMP')}
                className="w-full bg-[#080808] border border-white/[0.03] rounded-[36px] p-7 flex items-center justify-between group transition-all hover:bg-white/[0.02] active:scale-[0.98] animate-in slide-in-from-bottom-5 fade-in duration-500"
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                    <Shield size={24} fill="currentColor" fillOpacity={0.1} />
                  </div>
                  <div className="text-left space-y-1.5">
                    <h4 className="text-lg font-black tracking-tight text-white/90 uppercase">{group.name}</h4>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-white/20 uppercase tracking-[0.1em]">
                      <div className="flex items-center space-x-1.5">
                        <Users size={12} className="opacity-50" />
                        <span>{group.members} Members</span>
                      </div>
                      <span className="opacity-20">|</span>
                      <span>{group.distance}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover:text-white/40 transition-colors">
                  <ArrowRight size={20} />
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(400%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScanResults;