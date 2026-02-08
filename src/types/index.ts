// Type definitions for the API Documentation Chatbot

// Streaming event types
export type StreamEventType = 'token' | 'metadata' | 'error' | 'done';

export interface StreamTokenEvent {
  type: 'token';
  content: string;
}

export interface StreamMetadataEvent {
  type: 'metadata';
  confidence: number;
  sources: Source[];
  lazy_loaded: boolean;
  suggested_urls: string[] | null;
}

export interface StreamErrorEvent {
  type: 'error';
  message: string;
}

export interface StreamDoneEvent {
  type: 'done';
}

export type StreamEvent = StreamTokenEvent | StreamMetadataEvent | StreamErrorEvent | StreamDoneEvent;

// Collection types (for future phases)
export interface Collection {
  id: string;
  name: string;
  url: string;
  documentCount: number;
  pendingUrls: number;
  ingestedAt: string;
}

// Query and Answer types (for future phases)
export interface Source {
  source: string;  // URL
  section?: string;  // Relevant section title
}

export interface QueryResult {
  question: string;
  answer: string;
  confidence: number;
  sources: Source[];
  lazyLoaded: boolean;
  suggestedUrls: string[] | null;
  timestamp: string;
}

// API Response types (for future phases)
export interface IngestResponse {
  status: 'success' | 'error';
  collection_id: string;
  collection_name: string;
  source_url: string;
  documents_parsed: number;
  documents_ingested: number;
  sitemap_discovered: boolean;
  pending_urls_count: number;
  message: string;
  error: string | null;
}

export interface QueryResponse {
  status: 'success' | 'error';
  query: string;
  answer: string;
  confidence: number;
  sources: Source[];
  lazy_loaded: boolean;
  suggested_urls: string[] | null;
  error: string | null;
}

// Message types for chat interface (for future phases)
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  answer?: QueryResult;
  timestamp: string;
  isStreaming?: boolean;  // True while answer is being streamed
  confidence?: number;
  sources?: Source[];
  lazyLoaded?: boolean;
  suggestedUrls?: string[] | null;
}