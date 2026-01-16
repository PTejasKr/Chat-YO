import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

const Failure: React.FC<{ onRetry: () => void, onBack: () => void }> = ({ onRetry, onBack }) => {
  return (
    <div 
      className="h-full bg-black p-8 flex flex-col items-center justify-between animate-in zoom-in-95 duration-500"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
    >
      <header className="relative flex items-center space-x-3 opacity-60">
        <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center text-red-600 border border-red-600/20">
            <AlertTriangle size={16} />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase">System_Diagnostics v4.0.2</span>
      </header>

      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="relative text-center space-y-8">
          <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center relative">
              <div className="absolute top-0 right-0 bg-[#990000] text-white text-[8px] font-mono px-1.5 py-0.5 rounded">ERR_0x9</div>
              <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white flex flex-col">
              <span className="text-blue-400 opacity-80 blur-[0.5px]">Jump Failed:</span>
              <span className="text-red-500 blur-[0.5px]">Connection Dropped</span>
          </h1>
          <div className="w-32 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="w-full max-w-xs bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-3 font-mono text-[10px] leading-relaxed">
            <p className="text-white/40"><span className="text-white/20">[0.443s]</span> ATTEMPTING_HANDSHAKE...</p>
            <p className="text-red-500 uppercase font-bold"><span className="text-white/20">[0.892s]</span> NODE_UNREACHABLE</p>
            <p className="text-yellow-500 uppercase"><span className="text-white/20">[1.201s]</span> ENCRYPTION_MISMATCH: TRUNCATED</p>
            <p className="text-red-600 border-b border-red-600/20 pb-1 font-bold underline"><span className="text-white/20">[FAIL]</span> TUNNEL_HANDSHAKE_TIMEOUT</p>
            <p className="text-white/20"><span className="text-white/20">[RETRY]</span> WAITING FOR COMMAND_</p>
        </div>

        <div className="text-center px-4">
            <p className="text-xs text-white/40 leading-relaxed italic">
              The secure tunnel collapsed during the transit phase. Your identity remains shielded, but the room has been purged.
            </p>
        </div>
      </div>

      <div className="w-full space-y-3 max-w-sm">
          <button 
            onClick={onRetry}
            className="w-full h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center space-x-3 font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
              <RefreshCw size={20} />
              <span>Retry Handshake</span>
          </button>
          <button 
            onClick={onBack}
            className="w-full h-16 bg-[#0A0A0A] border border-white/10 text-white rounded-[24px] flex items-center justify-center space-x-3 font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
          >
              <Home size={20} className="text-white/40" />
              <span>Return to Main Void</span>
          </button>
      </div>
    </div>
  );
};

export default Failure;