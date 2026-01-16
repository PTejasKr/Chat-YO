import React, { useState, useEffect } from 'react';
import { Screen, IdentityProfile, Room } from './types';
import * as api from './services/api';
import Entrance from './components/Entrance';
import Identity from './components/Identity';
import Dashboard from './components/Dashboard';
import TransitionUI from './components/TransitionUI';
import CreateRoom from './components/CreateRoom';
import Scanner from './components/Scanner';
import ScanResults from './components/ScanResults';
import RoomInvite from './components/RoomInvite';
import Chat from './components/Chat';
import Settings from './components/Settings';
import PrivacyProtocols from './components/PrivacyProtocols';
import Profile from './components/Profile';
import Handshake from './components/Handshake';
import Panic from './components/Panic';
import Termination from './components/Termination';
import Failure from './components/Failure';
import BottomNav from './components/BottomNav';

const STORAGE_KEY = 'CHATYO_IDENTITY_v1';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ENTRANCE);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  
  const [rooms, setRooms] = useState<Room[]>(() => api.getActiveRooms());

  const [profile, setProfileState] = useState<IdentityProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    return {
      alias: 'Neon-Samurai',
      seed: Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => Math.random() > 0.95)),
      color: '#FFFFFF',
      complexity: 3,
      symmetry: 1,
      density: 1
    };
  });

  // Effect to periodically refresh the list of active rooms
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(api.getActiveRooms());
    }, 5000); // Check for expired rooms every 5s
    return () => clearInterval(interval);
  }, []);

  const setProfile = (newProfile: IdentityProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  const [privacySettings, setPrivacySettings] = useState({
    phoneBlur: true,
    convertIP: false,
    autoCoordinate: false,
    certPinning: true,
    ttl: 120 // minutes
  });
  
  const [encryptionProtocol, setEncryptionProtocol] = useState('AES-256');

  const handleCreateRoom = (name: string, code: string, ttl: number, visibility: 'CODE' | 'PROXIMITY', range?: number) => {
    const newRoom = api.initializeRoom(name, code, ttl, visibility, range);
    setRooms(api.getActiveRooms());
    setActiveRoomId(newRoom.id);
    setCurrentScreen(visibility === 'PROXIMITY' ? Screen.HANDSHAKE : Screen.INVITE);
  };

  const handlePanic = () => {
    api.terminateAllSessions();
    setRooms([]);
    setActiveRoomId(null);
    setCurrentScreen(Screen.TERMINATION);
  };

  const handleBridgeJoin = (roomName: string, roomCode: string) => {
    const joinedRoom = api.joinRoom(roomName, roomCode);
    setRooms(api.getActiveRooms());
    setActiveRoomId(joinedRoom.id);
    setCurrentScreen(Screen.HANDSHAKE);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ENTRANCE:
        return <Entrance onComplete={() => setCurrentScreen(Screen.IDENTITY)} />;
      case Screen.IDENTITY:
        return (
          <Identity 
            profile={profile} 
            setProfile={setProfile} 
            onConnect={() => setCurrentScreen(Screen.DASHBOARD)}
            onSettings={() => setCurrentScreen(Screen.SETTINGS)}
          />
        );
      case Screen.DASHBOARD:
        return <Dashboard 
          rooms={rooms}
          onSelectRoom={(id) => {
            setActiveRoomId(id);
            setCurrentScreen(Screen.CHAT);
          }}
          onCreateRoom={() => setCurrentScreen(Screen.CREATE_ROOM)}
          onGoToSettings={() => setCurrentScreen(Screen.SETTINGS)}
        />;
      case Screen.SETTINGS:
        return (
          <Settings 
            onBack={() => setCurrentScreen(Screen.DASHBOARD)}
            onPrivacy={() => setCurrentScreen(Screen.PRIVACY_PROTOCOLS)}
            onProfile={() => setCurrentScreen(Screen.PROFILE)}
            onNavChange={(s) => setCurrentScreen(s)}
          />
        );
      case Screen.PRIVACY_PROTOCOLS:
        return (
          <PrivacyProtocols 
            settings={privacySettings}
            onUpdate={setPrivacySettings}
            encryptionProtocol={encryptionProtocol}
            onSetEncryptionProtocol={setEncryptionProtocol}
            onBack={() => setCurrentScreen(Screen.SETTINGS)} 
            onNavChange={(s) => setCurrentScreen(s)}
          />
        );
      case Screen.PROFILE:
        return (
          <Profile 
            profile={profile} 
            setProfile={setProfile} 
            onBack={() => setCurrentScreen(Screen.SETTINGS)} 
            onNavChange={(s) => setCurrentScreen(s)}
          />
        );
      case Screen.SCANNER:
        return <Scanner 
          profile={profile}
          onScanComplete={() => setCurrentScreen(Screen.SCAN_RESULTS)}
        />;
      case Screen.SCAN_RESULTS:
        return <ScanResults 
          onBack={() => setCurrentScreen(Screen.DASHBOARD)}
          onJoinRoom={(name, code) => handleBridgeJoin(name, code)}
        />;
      case Screen.TRANSITION:
        return <TransitionUI onComplete={() => setCurrentScreen(Screen.CREATE_ROOM)} />;
      case Screen.CREATE_ROOM:
        return (
          <CreateRoom 
            onInitialize={handleCreateRoom} 
            onBack={() => setCurrentScreen(Screen.DASHBOARD)}
            onNavChange={(s) => setCurrentScreen(s)}
          />
        );
      case Screen.INVITE:
        return activeRoom ? (
          <RoomInvite 
            roomName={activeRoom.name} 
            secretCode={activeRoom.code} 
            ttlMinutes={activeRoom.ttl}
            onProceed={() => setCurrentScreen(Screen.HANDSHAKE)} 
          />
        ) : null;
      case Screen.HANDSHAKE:
        return (
          <Handshake 
            profile={profile}
            onComplete={() => setCurrentScreen(Screen.CHAT)} 
            onFailure={() => setCurrentScreen(Screen.FAILURE)} 
          />
        );
      case Screen.CHAT:
        return activeRoom ? (
          <Chat 
            roomId={activeRoom.id}
            roomName={activeRoom.name} 
            roomCode={activeRoom.code}
            alias={profile.alias} 
            profile={profile}
            privacySettings={{...privacySettings, ttl: activeRoom.ttl}}
            startTime={activeRoom.startTime}
            onBack={() => setCurrentScreen(Screen.DASHBOARD)} 
            onPanic={() => setCurrentScreen(Screen.PANIC)}
            onJoinNewRoom={handleBridgeJoin}
            onExpiry={() => {
              setRooms(api.getActiveRooms());
              setActiveRoomId(null);
              setCurrentScreen(Screen.TERMINATION);
            }}
          />
        ) : null;
      case Screen.PANIC:
        return <Panic onConfirm={handlePanic} onCancel={() => setCurrentScreen(Screen.CHAT)} />;
      case Screen.TERMINATION:
        return <Termination onReset={() => setCurrentScreen(Screen.ENTRANCE)} />;
      case Screen.FAILURE:
        return <Failure onRetry={() => setCurrentScreen(Screen.HANDSHAKE)} onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
      default:
        return <Entrance onComplete={() => setCurrentScreen(Screen.IDENTITY)} />;
    }
  };

  const showNav = [Screen.DASHBOARD, Screen.SETTINGS, Screen.PRIVACY_PROTOCOLS, Screen.PROFILE, Screen.CREATE_ROOM, Screen.CHAT, Screen.SCANNER, Screen.SCAN_RESULTS].includes(currentScreen);
  
  return (
    <div className="h-full w-full bg-black text-white overflow-hidden flex flex-col font-sans selection:bg-[#A1A7B2]/30 relative">
      <div className="particle-bg" />
      <div className="relative z-10 h-full flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className={`flex-1 overflow-hidden relative ${showNav ? 'pb-24' : ''}`}>
          {renderScreen()}
        </div>
        {showNav && (
          <BottomNav 
            active={currentScreen} 
            onChange={(s) => setCurrentScreen(s)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
