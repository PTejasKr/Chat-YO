import React, { useState } from 'react';
import { X, RefreshCw, Settings, Shield, Zap, Info, ChevronRight, Radio } from 'lucide-react';
import { Screen } from '../types';
import FlipDigit from './FlipDigit';

interface CreateRoomProps {
  onInitialize: (name: string, code: string, ttl: number, visibility: 'CODE' | 'PROXIMITY', range: number) => void;
  onBack: () => void;
  onNavChange: (s: Screen) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onInitialize, onBack, onNavChange }) => {
  const [roomName, setRoomName] = useState('VOID-9');
  const [ttl, setTtl] = useState(120);
  const [range, setRange] = useState(5.0); // kilometers
  const [securityPreset, setSecurityPreset] = useState<'MAX' | 'PERF' | 'CUSTOM'>('MAX');
  const [visibility, setVisibility] = useState<'SCAN' | 'CODE'>('CODE');

  const generateName = () => {
    const prefixes = ["GHOST", "VOID", "CYBER", "SILENT", "IRON", "NEON", "ALPHA", "OMEGA"];
    const id = Math.floor(Math.random() * 99);
    setRoomName(`${prefixes[Math.floor(Math.random() * prefixes.length)]}-${id}`);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 1 || i === 3) code += ' ';
    }
    return code;
  };

  const ttlHours = Math.floor(ttl / 60).toString().padStart(2, '0');
  const ttlMinutes = (ttl % 60).toString().padStart(2, '0');

  const rangeMain = Math.floor(range).toString().padStart(1, '0');
  const rangeDec = Math.round((range % 1) * 10).toString();

  return (
    <div className="h-full flex flex-col bg-black text-white animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-36">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-black/90 backdrop-blur-md z-30">
        <button onClick={onBack} className="p-2 text-white/60 hover:text-white transition-all">
          <X size={24} />
        </button>
        <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/60 font-mono">Room Config</h2>
        <button className="p-2 text-white/60 hover:text-white transition-all">
          <Settings size={20} />
        </button>
      </header>

      <div className="flex-1 px-8 py-8 space-y-10">
        {/* Room Name Input */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1 text-white/40">
            <div className="w-1.5 h-1.5 rounded-full border border-current flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-current rounded-full" />
            </div>
            <h3 className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">Designation</h3>
          </div>
          
          <div className="relative group">
            <input 
              value={roomName}
              onChange={(e) => setRoomName(e.target.value.toUpperCase())}
              placeholder="ENTER_DESIGNATION..."
              className="w-full bg-[#080808] border border-white/5 rounded-3xl p-6 text-2xl font-black tracking-tight outline-none focus:border-white/20 transition-all text-white placeholder:text-white/10 uppercase"
            />
            <button 
              onClick={generateName}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </section>

        {/* Accessibility Toggle */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 text-white/40">
              <Info size={12} />
              <h3 className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">Entry Channel</h3>
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{visibility === 'SCAN' ? 'Radio Proximity' : 'Cipher Logic'}</span>
          </div>
          <div className="bg-[#080808] border border-white/5 rounded-3xl p-2 flex">
            <button 
              onClick={() => setVisibility('SCAN')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${
                visibility === 'SCAN' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/20'
              }`}
            >
              <Radio size={14} />
              <span>Proximity</span>
            </button>
            <button 
              onClick={() => setVisibility('CODE')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${
                visibility === 'CODE' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/20'
              }`}
            >
              <Shield size={14} />
              <span>Secure Code</span>
            </button>
          </div>
        </section>

        {/* Broadcast Range Slider - Contextual */}
        {visibility === 'SCAN' && (
          <section className="space-y-4 animate-in slide-in-from-top duration-500">
            <div className="flex justify-between items-start px-1">
              <div className="flex items-center space-x-2 text-white/40 pt-1">
                <Radio size={12} className="text-gray-500 animate-pulse" />
                <h3 className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">Broadcast Boundary</h3>
              </div>
              <div className="flex items-start space-x-1 pt-1">
                <FlipDigit value={rangeMain} size="xs" />
                <span className="text-white/20 font-bold leading-none h-8 flex items-center mt-[-2px]">.</span>
                <FlipDigit value={rangeDec} label="KM" size="xs" />
              </div>
            </div>
            <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-500/5 pointer-events-none opacity-20" />
              <input 
                type="range" 
                min="0" max="10.0" step="0.1"
                value={range}
                onChange={(e) => setRange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-gray-500 cursor-pointer relative z-10"
              />
              <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase tracking-widest">
                <span>0.0 KM</span>
                <span>5.0 KM</span>
                <span>10.0 KM</span>
              </div>
            </div>
          </section>
        )}

        {/* TTL Slider */}
        <section className="space-y-4">
          <div className="flex justify-between items-start px-1">
            <div className="flex items-center space-x-2 text-white/40 pt-1">
              <Zap size={12} className="text-gray-500" />
              <h3 className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">Persistence (TTL)</h3>
            </div>
            <div className="flex items-start space-x-1 pt-1">
              <FlipDigit value={ttlHours} label="H" size="xs" />
              <span className="text-white/10 font-bold leading-none h-8 flex items-center mt-[-2px]">:</span>
              <FlipDigit value={ttlMinutes} label="M" size="xs" />
            </div>
          </div>
          <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 space-y-4">
            <input 
              type="range" 
              min="5" max="1440" step="5"
              value={ttl}
              onChange={(e) => setTtl(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-white cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase tracking-widest">
              <span>5M</span>
              <span>6H</span>
              <span>12H</span>
              <span>24H</span>
            </div>
          </div>
           <p className="text-center text-[9px] font-mono text-white/20 px-4">NOTE: TTL IS PERMANENT AND CANNOT BE ALTERED AFTER INITIALIZATION.</p>
        </section>

        {/* Security Matrix */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1 text-white/40">
            <Shield size={12} />
            <h3 className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold">Protocol Matrix</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'MAX', label: 'Maximum Trace Blur' },
              { id: 'PERF', label: 'High Throughput' },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => setSecurityPreset(preset.id as any)}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  securityPreset === preset.id 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : 'bg-[#080808] text-white/30 border-white/5 hover:border-white/10'
                }`}
              >
                <p className="text-[10px] font-black tracking-widest uppercase mb-1">{preset.id}</p>
                <p className="text-[9px] font-medium leading-tight opacity-60">{preset.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <div className="bg-white/[0.01] border border-white/[0.03] rounded-3xl p-6 text-center">
          <p className="text-[10px] font-mono text-white/20 leading-relaxed tracking-tight italic">
            "Once initialized, this node exists solely in RAM. Metadata is scrubbed upon session termination."
          </p>
        </div>

        {/* Initialize Action */}
        <button 
          onClick={() => onInitialize(roomName, visibility === 'SCAN' ? 'PROXIMITY_AUTH' : generateCode(), ttl, visibility === 'SCAN' ? 'PROXIMITY' : 'CODE', range)}
          className="w-full h-24 bg-[#A1A7B2] text-black rounded-[40px] flex items-center justify-center font-black text-lg tracking-[0.4em] uppercase transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(161,167,178,0.25)] group"
        >
          <span>Initialize Room</span>
          <ChevronRight size={20} className="ml-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;