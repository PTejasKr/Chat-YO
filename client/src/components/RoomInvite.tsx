import React, { useState, useEffect, useRef } from 'react';
import { Lock, Copy, Share, Check, EyeOff, Shield, ArrowRight } from 'lucide-react';
import FlipDigit from './FlipDigit';

interface RoomInviteProps {
  roomName: string;
  secretCode: string;
  ttlMinutes: number;
  onProceed: () => void;
}

const RoomInvite: React.FC<RoomInviteProps> = ({ roomName, secretCode, ttlMinutes, onProceed }) => {
  const [timeLeft, setTimeLeft] = useState(ttlMinutes * 60);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<'IDLE' | 'COPIED' | 'SHARED'>('IDLE');
  const [flickerSeed, setFlickerSeed] = useState(0);
  const [editableCode, setEditableCode] = useState(secretCode);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    const flickerTimer = setInterval(() => {
      setFlickerSeed(Math.random());
    }, 150);

    return () => {
      clearInterval(timer);
      clearInterval(flickerTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `CHATYO SECURE INVITE\nRoom: ${roomName}\nAccess Key: ${editableCode}\nLink: https://chatyo.void/join?room=${encodeURIComponent(roomName)}&code=${encodeURIComponent(editableCode)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${roomName} on CHATYO`,
          text: shareText,
          url: `https://chatyo.void/join?room=${encodeURIComponent(roomName)}&code=${encodeURIComponent(editableCode)}`
        });
        setShareStatus('SHARED');
        setTimeout(() => setShareStatus('IDLE'), 3000);
      } catch (err) {
        console.debug('Native share cancelled or failed:', err);
      }
    } else {
      // Fallback: Copy All
      try {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('COPIED');
        setTimeout(() => setShareStatus('IDLE'), 3000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const { m, s } = formatTime(timeLeft);
  const pulseSpeed = timeLeft < 60 ? '1s' : timeLeft < 300 ? '2s' : '4s';

  return (
    <div className="h-full bg-black flex flex-col p-8 animate-in fade-in duration-700 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="flex items-center justify-center space-x-4 mb-10 mt-4">
        <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-white/60" />
        </div>
        <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-white truncate">{roomName}</h1>
      </header>

      {/* Main QR Frame */}
      <div className="relative flex flex-col items-center justify-center mb-12">
        <div 
          className="relative p-8 bg-white/5 border border-white/5 rounded-[48px] overflow-hidden group transition-all"
          style={{ 
            animation: `qr-pulse ${pulseSpeed} infinite ease-in-out`
          }}
        >
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-[#A1A7B2] rounded-tl-[32px] m-4" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-[#A1A7B2] rounded-tr-[32px] m-4" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-[#A1A7B2] rounded-bl-[32px] m-4" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-[#A1A7B2] rounded-br-[32px] m-4" />
          
          <div className="w-64 h-64 bg-white rounded-[40px] flex items-center justify-center p-8 shadow-2xl relative">
            <div className="w-full h-full bg-[#1A1A1A] rounded-[32px] flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-8 gap-1.5 w-full h-full p-6 opacity-80">
                    {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-full aspect-square rounded-[2px] transition-colors duration-200 ${
                            (Math.random() + (flickerSeed * 0.1)) > 0.5 ? 'bg-white' : 'bg-transparent'
                          }`} 
                        />
                    ))}
                </div>

                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-[2px] bg-[#A1A7B2]/40 shadow-[0_0_15px_#A1A7B2] animate-qr-scan" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                    <div className="w-12 h-12 border-2 border-white/40 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/60 rounded-sm animate-pulse" />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access Key Section */}
      <div className="space-y-4 mb-8 max-w-sm mx-auto w-full">
        <p className="text-center text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase font-bold">One-time Access Key</p>
        
        <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 flex items-center transition-all hover:bg-white/[0.03] group">
          <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth px-2" ref={scrollContainerRef}>
            <input 
              type="text"
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="bg-transparent border-none outline-none text-xl font-mono font-black tracking-[0.2em] text-white w-full min-w-max uppercase"
              style={{ caretColor: '#A1A7B2' }}
            />
          </div>
          <button 
            onClick={copyToClipboard}
            className="ml-4 p-3 bg-white/5 rounded-2xl text-[#A1A7B2] transition-colors hover:bg-[#A1A7B2]/10 shrink-0"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="bg-[#080808] border border-white/5 rounded-[40px] p-8 space-y-6 mb-10 max-w-sm mx-auto w-full">
        <div className="flex flex-col items-center space-y-1">
          <p className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase font-bold">Self-destruct sequence active</p>
          <div className="w-40 h-[1px] bg-white/5" />
        </div>
        <div className="flex items-center justify-center space-x-3">
          {/* Minutes Block */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {m.split('').map((digit, index) => (
                <FlipDigit key={`min-${index}`} value={digit} size="lg" />
              ))}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Minutes</span>
          </div>

          {/* Separator */}
          <div className="text-5xl font-black text-white/10 pb-6">:</div>

          {/* Seconds Block */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {s.split('').map((digit, index) => (
                <FlipDigit key={`sec-${index}`} value={digit} size="lg" />
              ))}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Seconds</span>
          </div>
        </div>
      </div>

      {/* Final Actions */}
      <div className="space-y-4 max-w-sm mx-auto w-full pb-10">
        <button 
          onClick={handleShare}
          className={`w-full h-24 rounded-[40px] flex items-center justify-center space-x-4 font-black text-lg tracking-[0.2em] transition-all active:scale-[0.98] uppercase 
            ${shareStatus === 'IDLE' ? 'bg-[#A1A7B2] text-black hover:brightness-110 shadow-[0_20px_40px_rgba(161,167,178,0.2)]' : 'bg-green-600 text-white'}
          `}
        >
          {shareStatus === 'IDLE' ? (
            <>
              <Share size={24} fill="black" />
              <span>{navigator.share ? 'Native Share' : 'Copy Invite'}</span>
            </>
          ) : (
            <>
              <Check size={24} />
              <span>{shareStatus === 'COPIED' ? 'Copied to Buffer' : 'Shared Successfully'}</span>
            </>
          )}
        </button>

        <button 
          onClick={onProceed}
          className="w-full h-16 bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white rounded-[32px] flex items-center justify-center space-x-3 font-bold uppercase tracking-widest transition-all active:scale-95 group"
        >
          <span>Enter Node</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center justify-center space-x-3 opacity-30 mt-4">
          <EyeOff size={16} />
          <span className="text-[9px] font-mono tracking-[0.4em] uppercase font-bold">End-to-end encrypted invitation</span>
        </div>
      </div>

      <style>{`
        @keyframes qr-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(161, 167, 178, 0.05), 0 0 40px ${timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(161, 167, 178, 0.05)'}; }
          50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(161, 167, 178, 0.2), 0 0 60px ${timeLeft < 60 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(161, 167, 178, 0.2)'}; }
        }
        @keyframes qr-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(calc(100% + 100%)); }
        }
        .animate-qr-scan {
            animation: qr-scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RoomInvite;