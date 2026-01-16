import React, { useEffect, useState } from 'react';

interface FlipDigitProps {
  value: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ value, label, size = 'md', color }) => {
  const [current, setCurrent] = useState(value);
  const [next, setNext] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== next) {
      setCurrent(next);
      setNext(value);
      setFlipping(true);
      const timer = setTimeout(() => {
        setFlipping(false);
        setCurrent(value);
      }, 550); // a little less than anim duration
      return () => clearTimeout(timer);
    }
  }, [value, next]);

  const sizes = {
    xs: 'w-6 h-8 text-lg',
    sm: 'w-8 h-10 text-xl',
    md: 'w-12 h-16 text-3xl',
    lg: 'w-14 h-20 text-5xl'
  };
  
  // Use inline style to override CSS if a color is provided
  const dynamicStyle = color ? { color } : {};

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className={`flip-card ${sizes[size]} font-mono font-black relative`}>
        {/* Static background card */}
        <div className={`digit-card ${sizes[size]}`} style={dynamicStyle}>
            <div className="digit-card-top">{next}</div>
            <div className="digit-card-bottom">{current}</div>
        </div>

        {/* Flipping element */}
        <div className={`flipper ${flipping ? 'flipping' : ''} ${sizes[size]}`}>
            <div className="flipper-face flipper-front" style={dynamicStyle}>{current}</div>
            <div className="flipper-face flipper-back" style={dynamicStyle}>{next}</div>
        </div>
      </div>
      
      {label && (
        <div className="mt-1">
            <span className="text-[6px] text-white/20 uppercase font-mono tracking-widest">{label}</span>
        </div>
      )}
    </div>
  );
};

export default FlipDigit;
