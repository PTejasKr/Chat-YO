
export enum Screen {
  ENTRANCE = 'ENTRANCE',
  IDENTITY = 'IDENTITY',
  DASHBOARD = 'DASHBOARD',
  HANDSHAKE = 'HANDSHAKE',
  TRANSITION = 'TRANSITION',
  CREATE_ROOM = 'CREATE_ROOM',
  SCANNER = 'SCANNER',
  SCAN_RESULTS = 'SCAN_RESULTS',
  INVITE = 'INVITE',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
  PRIVACY_PROTOCOLS = 'PRIVACY_PROTOCOLS',
  PROFILE = 'PROFILE',
  PANIC = 'PANIC',
  TERMINATION = 'TERMINATION',
  FAILURE = 'FAILURE'
}

export interface Room {
  id: string;
  name: string;
  code: string;
  startTime: number;
  ttl: number; // in minutes
  type: 'OWNED' | 'JOINED';
  visibility: 'CODE' | 'PROXIMITY';
  proximityRange?: number; // in kilometers
}

export interface Node {
  id: string;
  name: string;
  distance: string;
  status: 'SECURE' | 'ENCRYPTED' | 'OFFLINE';
  members?: number;
  signal?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  isMe: boolean;
  type: 'TEXT' | 'LOCATION' | 'IMAGE' | 'AUDIO' | 'SYSTEM' | 'SYSTEM_INVITE';
  timestamp: number;
  status?: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'ERROR';
  metadata?: {
    roomName?: string;
    roomCode?: string;
    audioUrl?: string;
    imageUrl?: string;
    location?: {
      lat: number;
      lng: number;
    };
    maxPlays?: number;
    playCount?: number;
  };
}

export interface IdentityProfile {
  alias: string;
  seed: boolean[][];
  color: string;
  complexity: number;
  symmetry: number;
  density: number;
}