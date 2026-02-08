// Session Management Utilities

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  confidence?: number;
  sources?: Array<{
    source: string;  // URL
    section?: string;  // Relevant section title
  }>;
  lazyLoaded?: boolean;
  suggestedUrls?: string[] | null;
  timestamp: string;
  isStreaming?: boolean;  // True while answer is being streamed
}

export interface ChatSession {
  sessionId: string; // e.g., "stripe_session_1"
  name: string; // Display name
  url: string; // Original documentation URL (first URL for backward compatibility)
  urls: string[]; // All documentation URLs
  collectionId: string; // Backend collection ID
  documentCount: number;
  pendingUrls: number;
  createdAt: string;
  lastActivity: string;
  messages: Message[];
}

const SESSIONS_KEY = 'chat_sessions';

// Get all sessions from localStorage
export function getAllSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading sessions:', error);
    return [];
  }
}

// Get a specific session by ID
export function getSession(sessionId: string): ChatSession | null {
  const sessions = getAllSessions();
  return sessions.find(s => s.sessionId === sessionId) || null;
}

// Generate a unique session ID from a collection name
export function generateSessionId(name: string): string {
  const sessions = getAllSessions();
  
  // Sanitize name for use in URL (keep it readable)
  const baseName = name
    .toLowerCase()
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')         // Keep only alphanumeric and hyphens
    .replace(/-+/g, '-')                // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '');           // Remove leading/trailing hyphens
  
  // Find existing sessions with the same base
  const existingSessions = sessions.filter(s => 
    s.sessionId.startsWith(baseName + '_session_')
  );
  
  // Determine next session number
  let maxNumber = 0;
  existingSessions.forEach(s => {
    const match = s.sessionId.match(/_session_(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  
  return `${baseName}_session_${maxNumber + 1}`;
}

// Create a new session
export function createSession(
  urls: string[],
  collectionId: string,
  name: string,
  documentCount: number,
  pendingUrls: number
): ChatSession {
  const url = urls[0]; // First URL for backward compatibility
  const now = new Date().toISOString();
  
  // Use name as-is
  const sessionId = generateSessionId(name);
  
  const session: ChatSession = {
    sessionId,
    name: name.trim(),
    url,
    urls,
    collectionId,
    documentCount,
    pendingUrls,
    createdAt: now,
    lastActivity: now,
    messages: []
  };
  
  saveSession(session);
  return session;
}

// Save/update a session
export function saveSession(session: ChatSession): void {
  const sessions = getAllSessions();
  const index = sessions.findIndex(s => s.sessionId === session.sessionId);
  
  session.lastActivity = new Date().toISOString();
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

// Add a message to a session
export function addMessageToSession(sessionId: string, message: Message): void {
  const session = getSession(sessionId);
  if (!session) {
    console.error('Session not found:', sessionId);
    return;
  }
  
  session.messages.push(message);
  saveSession(session);
}

// Delete a session
export function deleteSession(sessionId: string): void {
  const sessions = getAllSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
}

// Update session URLs and document count (for add-urls feature)
export function updateSessionUrls(
  sessionId: string,
  newUrls: string[],
  totalDocuments: number
): ChatSession | null {
  const sessions = getAllSessions();
  const sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
  
  if (sessionIndex === -1) return null;
  
  const session = sessions[sessionIndex];
  
  // Merge new URLs (avoid duplicates)
  const mergedUrls = Array.from(new Set([...session.urls, ...newUrls]));
  
  // Update session
  const updatedSession: ChatSession = {
    ...session,
    urls: mergedUrls,
    documentCount: totalDocuments,
    lastActivity: new Date().toISOString()
  };
  
  sessions[sessionIndex] = updatedSession;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  
  return updatedSession;
}

// Clear all sessions
export function clearAllSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

// Migrate old collection to new session format (backward compatibility)
export function migrateOldCollection(): void {
  const oldCollection = localStorage.getItem('currentCollection');
  if (!oldCollection) return;
  
  try {
    const collection = JSON.parse(oldCollection);
    const sessions = getAllSessions();
    
    // Check if already migrated
    const exists = sessions.some(s => s.collectionId === collection.id);
    if (exists) {
      localStorage.removeItem('currentCollection');
      return;
    }
    
    // Create session from old collection
    const migrationName = collection.name || 'Migrated Collection';
    const session: ChatSession = {
      sessionId: generateSessionId(migrationName),
      name: migrationName.trim(),
      url: collection.url,
      urls: [collection.url], // Migrate single URL to array
      collectionId: collection.id,
      documentCount: collection.documentCount,
      pendingUrls: collection.pendingUrls,
      createdAt: collection.ingestedAt || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messages: []
    };
    
    saveSession(session);
    localStorage.removeItem('currentCollection');
  } catch (error) {
    console.error('Error migrating old collection:', error);
  }
}
