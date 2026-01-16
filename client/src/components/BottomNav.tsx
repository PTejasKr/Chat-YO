import React from 'react';
import { MessageSquare, Shield, Radio } from 'lucide-react';
import { Screen } from '../types';

const BottomNav: React.FC<{ active: Screen, onChange: (s: Screen) => void }> = ({ active, onChange }) => {
  const items = [
    { id: Screen.DASHBOARD, label: 'CHATS', icon: MessageSquare },
    { id: Screen.SCANNER, label: 'SCAN', icon: Radio },
    { id: Screen.SETTINGS, label: 'VAULT', icon: Shield }
  ];

  const screenToActiveButtonMap: { [key in Screen]?: Screen } = {
    [Screen.DASHBOARD]: Screen.DASHBOARD,
    [Screen.CHAT]: Screen.DASHBOARD,
    [Screen.CREATE_ROOM]: Screen.DASHBOARD,
    [Screen.INVITE]: Screen.DASHBOARD,
    [Screen.SCANNER]: Screen.SCANNER,
    [Screen.SCAN_RESULTS]: Screen.SCANNER,
    [Screen.SETTINGS]: Screen.SETTINGS,
    [Screen.PRIVACY_PROTOCOLS]: Screen.SETTINGS,
    [Screen.PROFILE]: Screen.SETTINGS,
  };

  const getIsActive = (itemId: Screen) => {
    return screenToActiveButtonMap[active] === itemId;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100]">
      <div 
        className="bg-black/80 backdrop-blur-2xl border-t border-white/10 rounded-t-[2.5rem] h-24 flex justify-around items-center px-4 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0rem) + 0.5rem)' }}
      >
        {items.map(item => {
          const isActive = getIsActive(item.id);
          return (
            <button 
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col-reverse items-center space-y-reverse space-y-1 relative transition-all w-20 h-16 justify-center rounded-2xl ${isActive ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-all duration-300 ${isActive ? 'scale-100' : 'scale-90'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;