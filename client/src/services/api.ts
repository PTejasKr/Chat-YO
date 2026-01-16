// CHATYO - Simulated Backend API
// This service mimics a real backend, handling all data persistence and business logic.
// All components should interact with this service instead of directly with localStorage.

import { Room, Message, IdentityProfile } from '../types';
import { NEARBY_NODES, NEARBY_GROUPS } from '../constants';

const ROOMS_KEY = 'CHATYO_ROOMS_v2';
const MESSAGE_PREFIX = 'CY_MSG_BUFFER_v2_';
const MAX_MESSAGES_PER_ROOM = 50;

// --- Private Helper Functions ---

const getRoomsFromStorage = (): Room[] => {
  try {
    const data = localStorage.getItem(ROOMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("API: Failed to retrieve rooms", e);
    return [];
  }
};

const saveRoomsToStorage = (rooms: Room[]) => {
  try {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  } catch (e) {
    console.error("API: Failed to save rooms", e);
  }
};

const getMessagesFromStorage = (roomId: string): Message[] => {
  try {
    const data = localStorage.getItem(`${MESSAGE_PREFIX}${roomId}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`API: Failed to retrieve messages for room ${roomId}`, e);
    return [];
  }
};

const saveMessagesToStorage = (roomId: string, messages: Message[]) => {
  try {
    // Maintain a circular buffer by keeping only the last N messages
    const updated = messages.slice(-MAX_MESSAGES_PER_ROOM);
    localStorage.setItem(`${MESSAGE_PREFIX}${roomId}`, JSON.stringify(updated));
  } catch (e) {
    console.error(`API: Failed to save messages for room ${roomId}`, e);
  }
};


// --- Public API ---

/**
 * Initializes a new chat room and saves it.
 * @returns The newly created Room object.
 */
export const initializeRoom = (name: string, code: string, ttl: number, visibility: 'CODE' | 'PROXIMITY', range?: number): Room => {
  const newRoom: Room = {
    id: Date.now().toString(),
    name,
    code,
    startTime: Date.now(),
    ttl: ttl,
    type: 'OWNED',
    visibility,
    proximityRange: range
  };

  const rooms = getRoomsFromStorage();
  saveRoomsToStorage([...rooms, newRoom]);
  
  const welcomeMessage: Message = {
      id: '1', 
      sender: 'SYSTEM', 
      content: 'Session Initialized. End-to-end tunnel verified. Identity shrouded.', 
      type: 'SYSTEM', 
      isMe: false, 
      timestamp: Date.now() 
  };
  saveMessagesToStorage(newRoom.id, [welcomeMessage]);

  return newRoom;
};

/**
 * Simulates joining a room via an invite code or proximity scan.
 * @returns The joined Room object.
 */
export const joinRoom = (name: string, code: string): Room => {
    const rooms = getRoomsFromStorage();
    const existingRoom = rooms.find(r => r.name === name && r.code === code);
    if (existingRoom) {
        return existingRoom;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name,
      code,
      startTime: Date.now(),
      ttl: 60, // Default TTL for joined rooms
      type: 'JOINED',
      visibility: code === 'PROXIMITY_AUTH' ? 'PROXIMITY' : 'CODE'
    };
    
    saveRoomsToStorage([...rooms, newRoom]);
    
    const welcomeMessage: Message = {
      id: '1', 
      sender: 'SYSTEM', 
      content: `Bridge established to ${name}. Network latency nominal.`, 
      type: 'SYSTEM', 
      isMe: false, 
      timestamp: Date.now() 
    };
    saveMessagesToStorage(newRoom.id, [welcomeMessage]);

    return newRoom;
}


/**
 * Fetches all active rooms and cleans up expired ones.
 * @returns An array of active Room objects.
 */
export const getActiveRooms = (): Room[] => {
  const now = Date.now();
  const allRooms = getRoomsFromStorage();
  const activeRooms = allRooms.filter(room => {
    const isExpired = (now - room.startTime) / 60000 >= room.ttl;
    if (isExpired) {
      // Cleanup expired room messages
      localStorage.removeItem(`${MESSAGE_PREFIX}${room.id}`);
    }
    return !isExpired;
  });

  // If the list of rooms changed, update storage
  if (allRooms.length !== activeRooms.length) {
    saveRoomsToStorage(activeRooms);
  }

  return activeRooms;
};


/**
 * Retrieves all messages for a specific room.
 * @returns An array of Message objects.
 */
export const getMessages = (roomId: string): Message[] => {
  return getMessagesFromStorage(roomId);
};

/**
 * Simulates sending a message and getting a delayed bot response.
 */
export const sendMessage = async (roomId: string, message: Message): Promise<void> => {
    // 1. Save the user's message immediately
    const currentMessages = getMessagesFromStorage(roomId);
    saveMessagesToStorage(roomId, [...currentMessages, message]);
    
    // 2. Simulate network delay and bot thinking time
    const delay = 1500 + Math.random() * 2000;
    
    return new Promise(resolve => {
        setTimeout(() => {
            // 3. Craft and save the bot's response
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'Ghost-Protocol',
                content: generateBotResponse(message),
                isMe: false,
                type: 'TEXT',
                timestamp: Date.now()
            };
            const updatedMessages = getMessagesFromStorage(roomId);
            saveMessagesToStorage(roomId, [...updatedMessages, botResponse]);
            
            // 4. Resolve the promise after the bot has "sent" its message
            resolve();
        }, delay);
    });
};

const generateBotResponse = (userMessage: Message): string => {
    const content = userMessage.content.toLowerCase();
    if (userMessage.type === 'IMAGE') return "Visual data received. Analyzing signature...";
    if (userMessage.type === 'AUDIO') return "Acoustic transmission logged. Purging buffer.";
    if (userMessage.type === 'LOCATION') return "Coordinates locked. Obfuscating trace...";
    if (content.includes("secure") || content.includes("safe")) return "Affirmative. The channel is ghosted. All logs are ephemeral.";
    if (content.includes("who are you")) return "I am the whisper in the static. A guardian of the void.";
    if (content.includes("hello") || content.includes("hey")) return "Signal received. Speak freely.";
    return "Understood. The network is listening.";
}

/**
 * Updates a message's status (e.g., from 'SENT' to 'DELIVERED').
 */
export const updateMessageStatus = (roomId: string, messageId: string, status: Message['status']) => {
  const messages = getMessagesFromStorage(roomId);
  const updatedMessages = messages.map(msg =>
    msg.id === messageId ? { ...msg, status } : msg
  );
  saveMessagesToStorage(roomId, updatedMessages);
};

/**
 * Simulates scanning for nearby nodes/groups.
 */
export const scanForEntities = () => {
  return {
    nodes: NEARBY_NODES,
    groups: NEARBY_GROUPS,
  };
};

/**
 * Executes the Panic Protocol: wipes all data.
 */
export const terminateAllSessions = () => {
  try {
    const keysToRemove: string[] = [ROOMS_KEY];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(MESSAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log("API: PANIC - All session data purged.");
  } catch (e) {
    console.error("API: PANIC - Purge failed", e);
  }
};