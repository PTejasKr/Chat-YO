import React from 'react';
import { X, Share, Shield } from 'lucide-react';

interface ChatInfoModalProps {
  roomName: string;
  roomCode: string;
  onClose: () => void;
}

const ChatInfoModal: React.FC<ChatInfoModalProps> = ({ roomName, roomCode, onClose }) => {
  const inviteData = `CHATYO_JOIN::${roomName}::${roomCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(inviteData)}&bgcolor=0A0A0A&color=FFFFFF&qzone=1`;

  const handleShare = async () => {
    const shareText = `CHATYO SECURE INVITE\nRoom: ${roomName}\nAccess Key: ${roomCode}\n(Note: This app is a concept and not a real service)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${roomName} on CHATYO`,
          text: shareText,
        });
      } catch (err) {
        console.debug('Share cancelled:', err);
      }
    } else {
      // Fallback for desktop: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Invite details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[48px] p-8 w-full max-w-sm relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Shield size={32} className="text-white/60"/>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight uppercase">{roomName}</h2>
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/40">SECURE ENCLAVE</p>
          </div>
          
          <div className="p-4 bg-black/20 border border-white/5 rounded-3xl">
            <img src={qrUrl} alt={`QR code for ${roomName}`} width="192" height="192" className="rounded-2xl"/>
          </div>

          <p className="text-center font-mono text-xl font-bold tracking-[0.2em] text-white/80 bg-black/20 border border-white/5 rounded-2xl p-4 w-full">{roomCode}</p>

          <button onClick={handleShare} className="w-full h-16 bg-white text-black rounded-3xl flex items-center justify-center space-x-3 text-sm font-bold uppercase tracking-[0.2em] transition-all active:scale-95 group">
            <Share size={20} />
            <span>{navigator.share ? 'Native Share' : 'Copy Invite'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoModal;