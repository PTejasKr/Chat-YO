import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, MapPin, Send, Lock, Skull, Info, X, Check, CheckCheck, Wifi, Mic, Square, Play, Pause, ExternalLink, Navigation, Trash2, ArrowRight, Plus, Camera, Clock, XCircle, Map } from 'lucide-react';
import { Message, IdentityProfile } from '../types';
import * as api from '../services/api';
import FlipDigit from './FlipDigit';
import AudioCard from './AudioCard';
import ImageCard from './ImageCard';
import ChatInfoModal from './ChatInfoModal';
import LocationPickerModal from './LocationPickerModal';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const LocationCard: React.FC<{ lat: number, lng: number, isMe: boolean, isObfuscated: boolean }> = ({ lat, lng, isMe, isObfuscated }) => {
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const displayLat = isObfuscated ? `${lat.toFixed(2)}****` : lat.toFixed(6);
  const displayLng = isObfuscated ? `${lng.toFixed(2)}****` : lng.toFixed(6);

  return (
    <div className={`overflow-hidden rounded-[40px] border glass-panel transition-all hover:scale-[1.02] active:scale-[0.98] w-full max-w-[300px] shadow-2xl ${
        isMe ? 'rounded-tr-none' : 'rounded-tl-none'
    }`}>
      <div className="h-32 bg-[#050505] relative flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #A1A7B2 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        </div>
        <div className="scan-line opacity-20" />
        {!isObfuscated && (
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-500/20 rounded-full flex items-center justify-center animate-pulse border border-gray-500/30">
              <MapPin size={28} className="text-gray-400" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-6">
          <p className="text-[7px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">Live_Transmission</p>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{isObfuscated ? 'OBFUSCATED COORDINATES' : 'LOCATION METADATA'}</h4>
            <div className="flex flex-col text-[9px] font-mono text-white/40 space-y-0.5">
              <span>LAT_REF: {displayLat}</span>
              <span>LNG_REF: {displayLng}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
            <Navigation size={16} />
          </div>
        </div>
        
        <button 
          onClick={() => window.open(mapsUrl, '_blank')}
          className="w-full py-3.5 bg-white text-black rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95 group shadow-lg"
        >
          <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <span>Open Secure Map</span>
        </button>
      </div>
    </div>
  );
};

const InviteCard: React.FC<{ roomName?: string; roomCode?: string; onJoin: (name: string, code: string) => void; }> = ({ roomName, roomCode, onJoin }) => {
    if (!roomName || !roomCode) return null;
    
    const displayCode = roomCode.split(' ').map((part, index) => index > 0 ? part.replace(/./g, '•') : part).join(' ');

    return (
        <div className="glass-panel rounded-[32px] overflow-hidden max-w-sm mx-auto my-4 border-gray-500/20 border">
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] font-bold">System Transmission</p>
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{roomName}</h3>
                    </div>
                    <div className="w-12 h-12 bg-gray-500/10 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-500/20">
                        <Send size={24} />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Access Key:</p>
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 text-center">
                        <p className="font-mono text-xl font-bold tracking-[0.3em] text-white/80">{displayCode}</p>
                    </div>
                </div>
                
                <p className="text-xs text-white/30 text-center italic">
                    This is a one-time invitation to a secure enclave. Access is logged.
                </p>
            </div>
            <button 
              onClick={() => onJoin(roomName, roomCode)}
              className="w-full bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 font-bold uppercase tracking-[0.3em] text-xs py-5 flex items-center justify-center space-x-3 transition-all group"
            >
                <span>Join Bridge</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};


interface ChatProps {
  roomId: string;
  roomName: string;
  roomCode?: string;
  alias: string;
  profile: IdentityProfile;
  privacySettings: {
    phoneBlur: boolean;
    convertIP: boolean;
    autoCoordinate: boolean;
    certPinning: boolean;
    ttl: number;
  };
  startTime: number;
  onBack: () => void;
  onPanic: () => void;
  onJoinNewRoom: (name: string, code: string) => void;
  onExpiry: () => void;
}

const MessageStatusIcon = ({ status }: { status?: Message['status'] }) => {
  switch (status) {
    case 'SENDING':
      return <Clock size={14} className="text-black/30" />;
    case 'SENT':
      return <Check size={16} className="text-black/50" />;
    case 'DELIVERED':
      return <CheckCheck size={16} className="text-black/50" />;
    case 'READ':
      return <CheckCheck size={16} className="text-blue-500" />;
    case 'ERROR':
      return <XCircle size={14} className="text-red-500" />;
    default:
      return null;
  }
};

const Chat: React.FC<ChatProps> = ({ roomId, roomName, roomCode, alias, profile, privacySettings, startTime, onBack, onPanic, onJoinNewRoom, onExpiry }) => {
  const [messages, setMessages] = useState<Message[]>(() => api.getMessages(roomId));
  const [inputText, setInputText] = useState('');
  
  const calculateTimeLeft = useCallback(() => {
    const expiryTime = startTime + privacySettings.ttl * 60 * 1000;
    const left = Math.max(0, (expiryTime - Date.now()) / 1000);
    return left;
  }, [startTime, privacySettings.ttl]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Polling for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessages = api.getMessages(roomId);
      if (newMessages.length !== messages.length) {
        setMessages(newMessages);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [roomId, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Timer Countdown Logic
  useEffect(() => {
    // Initial check
    const initialLeft = calculateTimeLeft();
    setTimeLeft(initialLeft);
    if (initialLeft <= 0) {
        onExpiry();
        return;
    }

    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      
      if (left <= 0) {
        clearInterval(timer);
        onExpiry();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onExpiry]);

  const handleMessageUpdate = (updatedMsg: Message) => {
    api.updateMessageStatus(roomId, updatedMsg.id, updatedMsg.status);
    setMessages(prev => 
        prev.map(msg => msg.id === updatedMsg.id ? updatedMsg : msg)
    );
  };

  const sendMessage = async (content: string, type: Message['type'], audioData?: string, imageUrl?: string, location?: {lat: number, lng: number}) => {
    if (!content.trim() && !audioData && !imageUrl && !location) return;
    setInputText('');

    const metadata: Message['metadata'] = {
        audioUrl: audioData,
        imageUrl: imageUrl,
        location: location
    };

    if (type === 'AUDIO') {
        metadata.maxPlays = 2;
        metadata.playCount = 0;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: alias,
      content,
      isMe: true,
      type,
      timestamp: Date.now(),
      status: 'SENDING',
      metadata
    };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);

    try {
      await api.sendMessage(roomId, userMessage);
      
      // Simulate status progression now handled by backend, but we can fake it on frontend for responsiveness
      api.updateMessageStatus(roomId, userMessage.id, 'SENT');
      setMessages(api.getMessages(roomId));
      
      setTimeout(() => {
        api.updateMessageStatus(roomId, userMessage.id, 'DELIVERED');
        setMessages(api.getMessages(roomId));
        setTimeout(() => {
            api.updateMessageStatus(roomId, userMessage.id, 'READ');
            setMessages(api.getMessages(roomId));
        }, 1500 + Math.random() * 1000);
      }, 800 + Math.random() * 800);

    } catch (error) {
      console.error("Failed to send message:", error);
      api.updateMessageStatus(roomId, userMessage.id, 'ERROR');
      setMessages(api.getMessages(roomId));
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioBase64 = await blobToBase64(audioBlob);
            sendMessage('[Voice Transmission]', 'AUDIO', audioBase64);
            stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        setIsRecording(true);
        recordingTimerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Microphone access is required. Please check your browser permissions.");
    }
  };

  const handleStopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
      }
      if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
      }
      setIsRecording(false);
      setRecordingTime(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            sendMessage('[Image Transmission]', 'IMAGE', undefined, base64String);
        };
        reader.readAsDataURL(file);
    }
    setShowAttachmentMenu(false);
  };

  const handleSendMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        sendMessage(
            privacySettings.autoCoordinate ? '[Obfuscated Coordinates]' : '[Location Marker]',
            'LOCATION',
            undefined,
            undefined,
            { lat: latitude, lng: longitude }
        );
    }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not retrieve location. Please check your device's permissions.");
    });
    setShowAttachmentMenu(false);
  };

  const handleSelectLocation = (coords: { lat: number, lng: number }) => {
    sendMessage('[Location Marker]', 'LOCATION', undefined, undefined, coords);
    setShowLocationPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText, 'TEXT');
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getTimerStatus = (seconds: number) => {
      if (seconds <= 60) return 'critical';
      if (seconds <= 300) return 'warning';
      return 'normal';
  };
  
  const timerStatus = getTimerStatus(timeLeft);

  return (
    <div className="h-full flex flex-col bg-[#050505] animate-in fade-in duration-500">
      {showInfoModal && roomCode && <ChatInfoModal roomName={roomName} roomCode={roomCode} onClose={() => setShowInfoModal(false)} />}
      {showLocationPicker && <LocationPickerModal onConfirm={handleSelectLocation} onClose={() => setShowLocationPicker(false)} />}
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
      
      {/* Header */}
      <header 
        className="flex items-center justify-between p-4 border-b border-white/[0.03] bg-black/50 backdrop-blur-md sticky top-0 z-20"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
      >
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-2 text-white/60 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
          <button onClick={() => setShowInfoModal(true)} className="p-2 text-white/60 hover:text-white transition-colors"><Info size={22} /></button>
        </div>
        <div className="text-center">
          <h2 className="font-bold tracking-widest uppercase text-white/90 text-sm">{roomName}</h2>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${timerStatus === 'critical' ? 'bg-red-500' : timerStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span className={`transition-colors font-bold ${timerStatus === 'critical' ? 'text-red-500 animate-pulse-timer' : timerStatus === 'warning' ? 'text-yellow-500' : 'text-white/30'}`}>
              TTL: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button onClick={onPanic} className="p-2 text-red-600/60 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-90"><Skull size={22} /></button>
      </header>

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!msg.isMe && (
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 bg-white/5 flex items-center justify-center text-xs font-mono font-bold uppercase ${msg.sender === 'SYSTEM' ? 'text-gray-400' : 'text-white/40'}`}>
                {msg.sender.substring(0, 2)}
              </div>
            )}
            <div className={`flex flex-col space-y-2 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
              {!msg.isMe && <span className="text-[10px] font-bold text-white/30 ml-3">{msg.sender}</span>}
              {msg.type === 'SYSTEM' ? (
                <p className="text-center text-gray-400/50 text-[10px] font-mono tracking-widest uppercase py-4">{msg.content}</p>
              ) : msg.type === 'SYSTEM_INVITE' ? (
                <InviteCard roomName={msg.metadata?.roomName} roomCode={msg.metadata?.roomCode} onJoin={onJoinNewRoom} />
              ) : msg.type === 'IMAGE' && msg.metadata?.imageUrl ? (
                <ImageCard imageUrl={msg.metadata.imageUrl} isMe={msg.isMe} />
              ) : msg.type === 'LOCATION' && msg.metadata?.location ? (
                <LocationCard lat={msg.metadata.location.lat} lng={msg.metadata.location.lng} isMe={msg.isMe} isObfuscated={privacySettings.autoCoordinate} />
              ) : msg.type === 'AUDIO' && msg.metadata?.audioUrl ? (
                <AudioCard message={msg} isMe={msg.isMe} onUpdate={handleMessageUpdate} />
              ) : (
                <div className={`px-5 py-4 rounded-[32px] ${msg.isMe ? 'bg-[#A1A7B2] text-black rounded-br-none' : 'glass-panel rounded-bl-none'}`}>
                  <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}
               {msg.isMe && msg.type !== 'SYSTEM' && (
                <div className="flex items-center space-x-1.5 px-3">
                  <span className={`text-[9px] font-mono ${msg.isMe ? 'text-white/30' : 'text-black/30'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <MessageStatusIcon status={msg.status} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-black/80 backdrop-blur-md border-t border-white/[0.03] sticky bottom-0 z-20">
        <div className="relative">
          {showAttachmentMenu && (
            <div className="absolute bottom-full left-2 mb-2 flex space-x-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10 hover:bg-white/10 flex-col text-[8px] uppercase font-bold tracking-widest"><Camera size={20} className="mb-1" />IMG</button>
                <button onClick={handleSendMyLocation} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10 hover:bg-white/10 flex-col text-[8px] uppercase font-bold tracking-widest"><MapPin size={20} className="mb-1"/>My Loc</button>
                <button onClick={() => setShowLocationPicker(true)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10 hover:bg-white/10 flex-col text-[8px] uppercase font-bold tracking-widest"><Map size={20} className="mb-1"/>Loc</button>
            </div>
          )}
          <div className={`bg-[#0A0A0A] border border-white/5 rounded-[28px] p-1.5 flex items-center space-x-2 transition-all duration-300 focus-within:border-white/20 ${isRecording ? 'recording-glow' : ''}`}>
            {!isRecording && !inputText && (
              <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${showAttachmentMenu ? 'bg-white/10 text-white rotate-45' : 'bg-transparent text-white/40 hover:bg-white/5'}`}>
                <Plus size={24} />
              </button>
            )}
            
            {isRecording ? (
              <div className="flex-1 flex items-center justify-center space-x-4 h-12 px-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <p className="font-mono text-lg text-white/80 tracking-widest">{formatTime(recordingTime)}</p>
              </div>
            ) : (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Transmit signal..."
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-base text-white px-4 py-3 resize-none placeholder:text-white/20"
              />
            )}

            {inputText ? (
              <button onClick={() => sendMessage(inputText, 'TEXT')} className="w-12 h-12 bg-[#A1A7B2] rounded-full flex items-center justify-center text-black transition-transform active:scale-90 flex-shrink-0">
                <Send size={24} />
              </button>
            ) : (
              <button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
                  ${isRecording ? 'bg-red-500/80 text-white scale-110' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              >
                {isRecording ? <Square size={24} fill="white" /> : <Mic size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;