import React from 'react';
import { X, MapPin, Check } from 'lucide-react';

interface LocationPickerModalProps {
  onConfirm: (coords: { lat: number; lng: number }) => void;
  onClose: () => void;
}

const MOCK_COORDS = { lat: 40.7580, lng: -73.9855 }; // Times Square, NYC

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[48px] p-6 w-full max-w-sm relative animate-in zoom-in-95 duration-300 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors z-20 bg-black/30 rounded-full">
          <X size={20} />
        </button>

        <div className="flex flex-col space-y-4">
          <div className="text-center border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold tracking-tight uppercase">Select Transmission Point</h2>
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/40">PINPOINT A LOCATION TO SHARE</p>
          </div>
          
          <div className="w-full aspect-square bg-gray-900 rounded-3xl relative overflow-hidden border border-white/5">
            {/* Mock Map Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23555' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-green-900/10" />

            {/* Mock Map Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 bg-red-500/10 rounded-full animate-ping" />
              <MapPin size={40} className="text-red-500 absolute -top-8" fill="rgba(239, 68, 68, 0.4)" />
              <div className="w-4 h-4 bg-black rounded-full absolute -bottom-1 border-2 border-red-500" />
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-[9px] font-mono">
              <p className="text-white/80">LAT: {MOCK_COORDS.lat.toFixed(4)}</p>
              <p className="text-white/80">LNG: {MOCK_COORDS.lng.toFixed(4)}</p>
            </div>
          </div>
          
          <p className="text-center text-[9px] font-mono text-white/30 px-4">
            This is a simulation. For security, only a pre-defined location can be transmitted.
          </p>

          <button onClick={() => onConfirm(MOCK_COORDS)} className="w-full h-16 bg-white text-black rounded-3xl flex items-center justify-center space-x-3 text-sm font-bold uppercase tracking-[0.2em] transition-all active:scale-95 group">
            <Check size={20} />
            <span>Confirm & Transmit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;