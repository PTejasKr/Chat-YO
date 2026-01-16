import React from 'react';

interface ImageCardProps {
  imageUrl: string;
  isMe: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, isMe }) => {
  return (
    <div className={`overflow-hidden rounded-[40px] border glass-panel w-full max-w-[300px] shadow-2xl ${
        isMe ? 'bg-[#A1A7B2]/80 border-white/20 rounded-tr-none' : 'rounded-tl-none'
    }`}>
      <img src={imageUrl} alt="Shared content" className="w-full h-auto object-cover" />
    </div>
  );
};

export default ImageCard;