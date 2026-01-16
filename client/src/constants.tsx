
export const COLORS = {
  PITCH_BLACK: '#000000',
  SURFACE: '#0A0A0A',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B2B6BF',
  TEXT_MUTED: '#333333',
  PANIC: '#990000',
  VOID: '#A1A7B2',
  SUCCESS: '#00FF47'
};

// FIX: Added missing SECRET_CODE export for the Calculator component.
export const SECRET_CODE = '80085';

export const NEARBY_NODES = [
  { id: '1', name: 'Silent-Phoenix', distance: '120m', status: 'SECURE', signal: '98%' },
  { id: '2', name: 'Ghost-Protocol', distance: '450m', status: 'ENCRYPTED', signal: '64%' },
  { id: '3', name: 'Digital-Echo', distance: '0.8km', status: 'ENCRYPTED', signal: '42%' },
  { id: '4', name: 'Iron-Cipher', distance: '1.5km', status: 'OFFLINE', signal: '0%' }
];

export const NEARBY_GROUPS = [
  { id: 'g1', name: 'Crypto-Warriors', distance: '0.4 KM', members: 12, desc: 'Decentralized strategy talk only' },
  { id: 'g2', name: 'The Void', distance: '1.2 KM', members: 8, desc: 'No logs, no traces' }
];