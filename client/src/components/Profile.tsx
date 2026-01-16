import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Palette, Settings as Gear, Grid as GridIcon, Save, Check, User, Pencil, Loader2 } from 'lucide-react';
import { Screen, IdentityProfile } from '../types';

interface ProfileProps {
  profile: IdentityProfile;
  setProfile: (p: IdentityProfile) => void;
  onBack: () => void;
  onNavChange: (s: Screen) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile, onBack, onNavChange }) => {
  const [activeColor, setActiveColor] = useState(profile.color);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  
  const [tempAlias, setTempAlias] = useState(profile.alias);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const aliasInputRef = useRef<HTMLInputElement>(null);

  const [tempSeed, setTempSeed] = useState(profile.seed);
  const [tempComplexity, setTempComplexity] = useState(profile.complexity);
  const [tempSymmetry, setTempSymmetry] = useState(profile.symmetry);
  const [tempDensity, setTempDensity] = useState(profile.density);

  useEffect(() => {
    if (isEditingAlias && aliasInputRef.current) {
      aliasInputRef.current.focus();
      aliasInputRef.current.select();
    }
  }, [isEditingAlias]);

  const toggleCell = (row: number, col: number) => {
    const newSeed = [...tempSeed.map(r => [...r])];
    newSeed[row][col] = !newSeed[row][col];
    setTempSeed(newSeed);
    setIsSaved(false);
  };

  const regenerate = () => {
    const newSeed = Array.from({ length: 32 }, () => 
      Array.from({ length: 32 }, () => Math.random() > 0.95)
    );
    setTempSeed(newSeed);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsCommitting(true);
    // Simulate a brief "processing" phase for technical weight
    setTimeout(() => {
      setProfile({
        ...profile,
        alias: tempAlias.trim() || profile.alias,
        seed: tempSeed,
        color: activeColor,
        complexity: tempComplexity,
        symmetry: tempSymmetry,
        density: tempDensity
      });
      setIsCommitting(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  const colors = ['#A1A7B2', '#00FF47', '#FF3B30', '#FFCC00', '#FFFFFF'];

  const complexityLimit = tempComplexity * 6; 
  const densityValues = [2, 4, 8, 16, 32];
  const density = densityValues[tempDensity];
  const padding = tempSymmetry * 2;

  return (
    <div className="h-full flex flex-col bg-black text-white animate-in slide-in-from-left duration-500 overflow-y-auto no-scrollbar pb-36">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-black z-20">
        <button onClick={onBack} className="p-2 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">Identity Config</h2>
        <button 
          onClick={regenerate} 
          className="p-2 text-white/60 hover:text-white active:rotate-90 transition-transform duration-300"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="flex-1 px-6 py-8 space-y-10">
        {/* Alias Input Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <User size={14} className="text-white/40" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 font-bold uppercase">Display Name</h3>
          </div>
          
          <div className={`bg-[#0A0A0A] border rounded-[32px] p-6 flex items-center justify-between group transition-all duration-300 ${isEditingAlias ? 'border-white/20 bg-white/5' : 'border-white/5'}`}>
            {isEditingAlias ? (
              <div className="flex-1 flex items-center space-x-4">
                <input
                  ref={aliasInputRef}
                  value={tempAlias}
                  onChange={(e) => {
                    setTempAlias(e.target.value);
                    setIsSaved(false);
                  }}
                  onBlur={() => setIsEditingAlias(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingAlias(false)}
                  className="bg-transparent border-none outline-none text-2xl font-black tracking-tight uppercase text-white w-full"
                  maxLength={10}
                />
                <span className={`text-sm font-mono transition-colors shrink-0 ${
                    tempAlias.length > 8 ? 'text-yellow-400' : 'text-white/30'
                } ${tempAlias.length === 10 ? 'text-red-500 font-bold' : ''}`}>
                    {tempAlias.length}/10
                </span>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingAlias(true)}
                className="text-2xl font-black tracking-tight uppercase text-white/90 group-hover:text-white transition-colors cursor-text truncate flex-1"
              >
                {tempAlias}
              </div>
            )}
            <button 
              onClick={() => setIsEditingAlias(!isEditingAlias)}
              className="p-2 text-white/10 hover:text-white transition-colors ml-4"
            >
              {isEditingAlias ? <Check size={24} className="text-green-500" /> : <Pencil size={20} />}
            </button>
          </div>
        </section>

        {/* Interactive Grid Container */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-full aspect-square max-w-[320px] bg-[#0A0A0A] border border-white/10 rounded-[40px] p-6 grid overflow-hidden shadow-2xl relative transition-all duration-500 ${isCommitting ? 'animate-pulse brightness-150 blur-[1px]' : ''} ${isSaved ? 'animate-[grid-flash_0.6s_ease-out]' : ''}`}
            style={{ 
              gridTemplateColumns: `repeat(${density}, 1fr)`,
              gridTemplateRows: `repeat(${density}, 1fr)`,
              gap: '2px',
              padding: `${padding}px`
            }}
          >
            {Array.from({ length: density * density }).map((_, i) => {
              const r = Math.floor(i / density);
              const c = i % density;
              const seedR = Math.floor((r / density) * 32);
              const seedC = Math.floor((c / density) * 32);
              const isActive = tempSeed[seedR][seedC];
              const isLocked = seedR > complexityLimit;

              return (
                <div 
                  key={i}
                  onClick={() => !isLocked && toggleCell(seedR, seedC)}
                  className={`w-full h-full rounded-[1px] transition-all duration-300 relative
                    ${isLocked ? 'opacity-5 cursor-not-allowed bg-white/5' : 'cursor-pointer hover:z-10'}
                  `}
                  style={{ 
                    backgroundColor: isActive ? activeColor : 'rgba(255,255,255,0.03)',
                    boxShadow: isActive ? `0 0 10px ${activeColor}44` : 'none',
                    transform: isActive ? 'scale(1)' : 'scale(0.85)',
                  }}
                >
                   {isActive && !isLocked && (
                     <div className="absolute inset-0 bg-white/20 animate-ping opacity-10 rounded-full" />
                   )}
                </div>
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </div>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-6">Node Signature Matrix</p>
        </div>

        {/* Color Palette */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <Palette size={14} className="text-gray-500" />
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 font-bold uppercase">Signature Color</h3>
          </div>
          <div className="flex justify-between px-2">
            {colors.map(c => (
              <button 
                key={c}
                onClick={() => {
                  setActiveColor(c);
                  setIsSaved(false);
                }}
                className={`w-10 h-10 rounded-xl transition-all duration-300 ${activeColor === c ? 'scale-110 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'scale-90 opacity-40 hover:opacity-100 hover:scale-100 border border-white/10'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Sliders Hub */}
        <div className="space-y-8 bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-white/30 uppercase">
              <span>Complexity</span>
              <span>Lvl 0{tempComplexity}</span>
            </div>
            <input 
              type="range" min="0" max="5" step="1" 
              value={tempComplexity}
              onChange={(e) => {
                setTempComplexity(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer" 
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-white/30 uppercase">
              <span>Symmetry</span>
              <span>{tempSymmetry > 5 ? 'Radial' : 'Linear'}</span>
            </div>
            <input 
              type="range" min="0" max="10" step="1" 
              value={tempSymmetry}
              onChange={(e) => {
                setTempSymmetry(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer" 
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-white/30 uppercase">
              <span>Visual Density</span>
              <span>{density}x{density}</span>
            </div>
            <input 
              type="range" min="0" max="4" step="1" 
              value={tempDensity}
              onChange={(e) => {
                setTempDensity(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer" 
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={isSaved || isCommitting}
          className={`w-full h-20 rounded-[28px] flex items-center justify-center space-x-4 font-bold tracking-[0.2em] uppercase transition-all duration-500 active:scale-[0.98] shadow-2xl overflow-hidden relative
            ${isSaved ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-[#A1A7B2] text-black hover:brightness-110'}
            ${isCommitting ? 'opacity-70 scale-[0.98] cursor-wait' : ''}
          `}
        >
          {isCommitting ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span>Syncing Buffer...</span>
              <div className="absolute bottom-0 left-0 h-1 bg-black/10 w-full overflow-hidden">
                <div className="h-full bg-black/40 animate-[progress_0.8s_linear]" />
              </div>
            </>
          ) : isSaved ? (
            <>
              <Check size={24} className="animate-in zoom-in" />
              <span>Identity Committed</span>
            </>
          ) : (
            <>
              <Save size={24} />
              <span>Save & Commit</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes grid-flash {
          0% { filter: brightness(1) blur(0px); transform: scale(1); }
          30% { filter: brightness(3) blur(4px); transform: scale(1.02); }
          100% { filter: brightness(1) blur(0px); transform: scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Profile;