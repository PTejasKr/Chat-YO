import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Waves } from 'lucide-react';
import { Message } from '../types';

interface AudioCardProps {
  message: Message;
  isMe: boolean;
  onUpdate: (updatedMessage: Message) => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) {
    return '00:00';
  }
  const floorSeconds = Math.floor(seconds);
  const m = Math.floor(floorSeconds / 60).toString().padStart(2, '0');
  const s = (floorSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const AudioCard: React.FC<AudioCardProps> = ({ message, isMe, onUpdate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { audioUrl, maxPlays = Infinity, playCount = 0 } = message.metadata || {};
  const remainingPlays = maxPlays - playCount;
  const isPlaybackLimited = maxPlays !== Infinity;
  const canPlay = isMe || !isPlaybackLimited || remainingPlays > 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!isMe && isPlaybackLimited) {
        const updatedMessage = {
            ...message,
            metadata: {
                ...message.metadata,
                playCount: (message.metadata?.playCount || 0) + 1,
            },
        };
        onUpdate(updatedMessage);
      }
      audio.play();
      setIsPlaying(true);
    }
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`glass-panel rounded-[32px] overflow-hidden w-full max-w-[280px] border ${isMe ? 'bg-[#A1A7B2]/80 border-white/20 rounded-tr-none' : 'rounded-tl-none'} ${!canPlay ? 'opacity-60' : ''}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="p-5 flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          disabled={!canPlay}
          className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed
            ${isPlaying ? 'bg-red-500/20 border border-red-500/30' : 'bg-black/20 border border-white/10'}`}
        >
          {isPlaying ? <Pause size={24} className="text-red-400" /> : <Play size={24} className={`ml-1 ${isMe ? 'text-black' : 'text-white'}`} />}
        </button>
        <div className="flex-1 space-y-3">
          <div className="w-full h-8 bg-black/20 flex items-center relative overflow-hidden rounded-lg">
            <Waves size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/10" />
            <div className={`absolute left-0 top-0 h-full rounded-lg ${isMe ? 'bg-black/20' : 'bg-white/20'}`} style={{ width: `${progress}%` }} />
            <div 
              className={`absolute top-0 h-full w-[2px] ${isMe ? 'bg-black/50' : 'bg-white'}`}
              style={{ left: `calc(${progress}% - 1px)` }}
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span className={`text-[10px] font-mono ${isMe ? 'text-black/60' : 'text-white/50'}`}>{formatTime(currentTime)}</span>
            {isPlaybackLimited && !isMe ? (
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${remainingPlays > 0 ? 'text-green-400/80' : 'text-red-500/80'}`}>
                    {remainingPlays > 0 ? `${remainingPlays} Play${remainingPlays > 1 ? 's' : ''} Left` : 'No Plays Left'}
                </span>
            ) : (
                <span className={`text-[10px] font-mono ${isMe ? 'text-black/60' : 'text-white/50'}`}>{formatTime(duration)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;