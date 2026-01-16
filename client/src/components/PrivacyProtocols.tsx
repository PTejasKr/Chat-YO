import React from 'react';
import { ChevronLeft, Shield, ShieldCheck, Settings as Gear, Lock } from 'lucide-react';
import { Screen } from '../types';
import FlipDigit from './FlipDigit';

interface PrivacyProtocolsProps {
  settings: {
    phoneBlur: boolean;
    convertIP: boolean;
    autoCoordinate: boolean;
    certPinning: boolean;
    ttl: number;
  };
  onUpdate: (newSettings: any) => void;
  encryptionProtocol: string;
  onSetEncryptionProtocol: (protocol: string) => void;
  onBack: () => void;
  onNavChange: (s: Screen) => void;
}

const PrivacyProtocols: React.FC<PrivacyProtocolsProps> = ({ settings, onUpdate, encryptionProtocol, onSetEncryptionProtocol, onBack, onNavChange }) => {

  const updateSetting = (key: string, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  const ttlHours = Math.floor(settings.ttl / 60).toString().padStart(2, '0');
  const ttlMinutes = (settings.ttl % 60).toString().padStart(2, '0');
  
  const encryptionOptions = [
    { id: 'AES-256', name: 'AES-256', desc: 'Standard & Fast' },
    { id: 'SIGNAL', name: 'Signal Protocol', desc: 'Forward Secrecy' },
    { id: 'NO-TRACE', name: 'NO-TRACE', desc: 'Experimental' },
  ];

  return (
    <div className="h-full flex flex-col bg-black text-white animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-36">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-black/90 backdrop-blur-md z-30">
        <button onClick={onBack} className="p-2 text-white/60 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">Privacy Protocols</h2>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-8 space-y-12">
        {/* Redaction Rules */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <Shield size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 font-bold uppercase">Redaction Rules</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'phoneBlur', label: 'Blur Phone Numbers (5-digit)', sub: 'Automatically redact partial digits in messages', active: settings.phoneBlur },
              { id: 'convertIP', label: 'Convert Address to IP', sub: 'Mask physical locations with network routing', active: settings.convertIP },
              { id: 'autoCoordinate', label: 'Auto-Coordinate Location', sub: 'Obfuscate precise GPS coordinates', active: settings.autoCoordinate }
            ].map((rule) => (
              <div key={rule.id} className="flex items-center justify-between px-2 py-1">
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold tracking-tight">{rule.label}</h4>
                  <p className="text-[11px] text-white/30">{rule.sub}</p>
                </div>
                <button 
                  onClick={() => updateSetting(rule.id, !rule.active)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${rule.active ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${rule.active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Session Security */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 font-bold uppercase">Default Session Security</h3>
          </div>

          <div className="space-y-8">
            <div className="px-2 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold tracking-tight">Room TTL (Time-To-Live)</h4>
                <div className="bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-xl flex items-center space-x-2">
                  <FlipDigit value={ttlHours} label="H" size="xs" />
                  <span className="text-blue-500 font-bold">:</span>
                  <FlipDigit value={ttlMinutes} label="M" size="xs" />
                </div>
              </div>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="5" 
                  max="1440" 
                  step="5" 
                  value={settings.ttl} 
                  onChange={(e) => updateSetting('ttl', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-600 cursor-pointer" 
                />
                <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] px-1 font-bold">
                  <span>5M</span>
                  <span>6H</span>
                  <span>12H</span>
                  <span>24H</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight">Enable Certificate Pinning</h4>
                <p className="text-[11px] text-white/30">Prevent Man-in-the-Middle (MitM) attacks</p>
              </div>
              <button 
                onClick={() => updateSetting('certPinning', !settings.certPinning)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.certPinning ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.certPinning ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Encryption Protocol */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <Lock size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 font-bold uppercase">Encryption Standard</h3>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-2 flex space-x-2">
            {encryptionOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSetEncryptionProtocol(opt.id)}
                className={`flex-1 p-4 rounded-2xl text-center transition-all ${encryptionProtocol === opt.id ? 'bg-white/5 border border-white/10' : 'opacity-40'}`}
              >
                <p className="text-xs font-bold tracking-tight">{opt.name}</p>
                <p className="text-[9px] text-white/30">{opt.desc}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-[9px] font-mono text-white/20 leading-relaxed px-4 uppercase tracking-[0.1em] italic">
            "Your chosen protocol will be applied to all new enclaves you initialize."
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyProtocols;