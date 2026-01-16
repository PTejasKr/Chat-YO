
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-32 left-8 w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded-full flex items-center justify-center text-blue-500 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.2)] hover:scale-110 active:scale-95 transition-all z-[100] group overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <MessageSquare size={28} fill="currentColor" fillOpacity={0.1} />
      <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
    </button>
  );
};

export default FloatingChatButton;
