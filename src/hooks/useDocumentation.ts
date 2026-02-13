import { useState, useCallback } from 'react';
import { StreamEvent } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 180000; // 3 minutes

// Conversation History Configuration
// Maximum number of recent messages to send as context
export const MAX_HISTORY_MESSAGES = 10;

// Helper function to parse backend errors into user-friendly messages
function parseErrorResponse(response: Response, errorData: any): string {
  const status = response.status;
  
  // Rate limit error (429)
  if (status === 429) {
    const detail = errorData.detail || '10 per 1 hour';
    return `Rate limit exceeded (${detail}). This project is just a preview and has limited rates. Please try again later.`;
  }
  
  // Server error (500)
  if (status === 500) {
    return 'The server encountered an error while processing your request. Please try again in a few moments or contact support if the issue persists.';
  }
  
  // Bad request errors (400)
  if (status === 400 && errorData.detail) {
    const detail = errorData.detail.toLowerCase();
    
    // Too many URLs
    if (detail.includes('too many urls')) {
      // Extract the numbers from the error message
      const maxMatch = errorData.detail.match(/maximum allowed: (\d+)/);
      const providedMatch = errorData.detail.match(/provided: (\d+)/);
      const max = maxMatch ? maxMatch[1] : '20';
      const provided = providedMatch ? providedMatch[1] : 'many';
      return `Too many URLs provided (${provided}). Maximum allowed is ${max}. Please split your request into smaller batches.`;
    }
    
    // Invalid URLs (missing API documentation keywords)
    if (detail.includes('invalid urls') && detail.includes('api documentation keywords')) {
      return `Invalid URLs detected. Currently we only support URLs containing keywords (api, doc, docs, documentation, reference, guide). \n\nThis ensures the service is used for API documentation only.`;
    }
    
    // Generic 400 error with detail
    return `${errorData.detail}`;
  }
  
  // Fallback for other errors
  if (errorData.detail) {
    return errorData.detail;
  }
  
  return `HTTP Error ${status}`;
}

interface IngestRequest {
  // New format with labels
  urls_with_label?: Record<string, string[]>;
  collection_name?: string;
  
  // Old format (backward compatibility)
  url?: string;
  max_initial_pages?: number;
  urls?: string[];
}

interface IngestResponse {
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

interface AddUrlsRequest {
  collection_id: string;
  urls_with_label: Record<string, string[]>;
}

interface AddUrlsResponse {
  status: 'success' | 'error';
  collection_id: string;
  urls_added: number;
  documents_parsed: number;
  documents_ingested: number;
  total_documents: number;
  message: string;
  error: string | null;
}

interface Source {
  source: string;  // URL
  section?: string;  // Relevant section title
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QueryResult {
  question: string;
  answer: string;
  confidence: number;
  sources: Source[];
  lazyLoaded: boolean;
  suggestedUrls: string[] | null;
  timestamp: string;
}

export function useDocumentation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Check backend health
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }, []);

  // Ingest documentation
  const ingestDocumentation = useCallback(async (
    request: IngestRequest
  ): Promise<IngestResponse> => {
    setLoading(true);
    setError(null);
    setLoadingMessage('APItome is reading the documentation and preparing your collection...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(`${API_BASE_URL}/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, use generic error
          throw new Error(`Server returned error ${response.status}`);
        }
        
        const errorMessage = parseErrorResponse(response, errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setLoadingMessage('');
        setLoading(false);
        return data as IngestResponse;
      } else {
        throw new Error(data.error || 'Ingestion failed');
      }
    } catch (error: any) {
      let errorMessage: string;
      
      if (error.name === 'AbortError') {
        errorMessage = '⏱️ Request timed out. The documentation may be too large or the server is taking too long to respond.';
      } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        errorMessage = 'Sorry, the service is currently unavailable. Please try again later.';
      } else {
        errorMessage = error.message || 'Failed to ingest documentation';
      }

      setError(errorMessage);
      setLoadingMessage('');
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Query documentation
  const queryDocumentation = useCallback(async (
    collectionId: string,
    query: string,
    enableLazyLoading: boolean = false,
    conversationHistory?: ConversationMessage[]
  ): Promise<QueryResult> => {
    setLoading(true);
    setError(null);
    setLoadingMessage('Searching documentation...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const requestBody: any = {
        collection_id: collectionId,
        query,
        enable_lazy_loading: enableLazyLoading
      };

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        requestBody.conversation_history = conversationHistory;
      }

      const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Collection not found. Please re-ingest documentation.');
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        const result: QueryResult = {
          question: data.query,
          answer: data.answer,
          confidence: data.confidence,
          sources: data.sources,
          lazyLoaded: data.lazy_loaded,
          suggestedUrls: data.suggested_urls,
          timestamp: new Date().toISOString()
        };

        setLoadingMessage('');
        setLoading(false);
        return result;
      } else {
        throw new Error(data.error || 'Query failed');
      }
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? 'Query timed out'
        : error.message || 'Failed to query documentation';

      setError(errorMessage);
      setLoadingMessage('');
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Add URLs to existing collection
  const addUrlsToCollection = useCallback(async (
    collectionId: string,
    urlsWithLabel: Record<string, string[]>
  ): Promise<AddUrlsResponse> => {
    setLoading(true);
    setError(null);
    setLoadingMessage('Adding URLs to collection...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const requestBody: AddUrlsRequest = {
        collection_id: collectionId,
        urls_with_label: urlsWithLabel
      };

      const response = await fetch(`${API_BASE_URL}/api/ingest/add-urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Server returned error ${response.status}`);
        }
        
        const errorMessage = parseErrorResponse(response, errorData);
        throw new Error(errorMessage);
      }

      const data: AddUrlsResponse = await response.json();
      
      setLoadingMessage('');
      setLoading(false);
      return data;

    } catch (error: any) {
      let errorMessage: string;
      
      if (error.name === 'AbortError') {
        errorMessage = '⏱️ Request timed out. Please try again.';
      } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        errorMessage = '🔌 Failed to connect to the backend. Make sure the backend is running at http://localhost:8000';
      } else {
        errorMessage = error.message || 'Failed to add URLs';
      }
      
      setError(errorMessage);
      setLoadingMessage('');
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Query documentation with streaming
  const queryDocumentationStream = useCallback(async (
    collectionId: string,
    query: string,
    onToken: (token: string) => void,
    onMetadata: (metadata: { confidence: number; sources: Source[]; lazyLoaded: boolean; suggestedUrls: string[] | null }) => void,
    onError: (error: string) => void,
    onDone: () => void,
    enableLazyLoading: boolean = false,
    conversationHistory?: ConversationMessage[]
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setLoadingMessage('Searching documentation...');

    try {
      const requestBody: any = {
        collection_id: collectionId,
        query,
        enable_lazy_loading: enableLazyLoading,
        stream: true  // Enable streaming
      };

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        requestBody.conversation_history = conversationHistory;
      }

      const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Collection not found. Please re-ingest documentation.');
        }
        
        // Handle rate limit and other errors with proper parsing
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`HTTP ${response.status}`);
        }
        
        // Parse and throw with proper error message
        const errorMessage = parseErrorResponse(response, errorData);
        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Check if we got a streaming response
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/event-stream')) {
        throw new Error('Expected streaming response but got: ' + contentType);
      }

      // Process SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse SSE format: "data: {json}"
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            
            try {
              const event: StreamEvent = JSON.parse(dataStr);

              switch (event.type) {
                case 'token':
                  onToken(event.content);
                  break;

                case 'metadata':
                  onMetadata({
                    confidence: event.confidence,
                    sources: event.sources,
                    lazyLoaded: event.lazy_loaded,
                    suggestedUrls: event.suggested_urls
                  });
                  break;

                case 'error':
                  onError(event.message);
                  break;

                case 'done':
                  onDone();
                  break;
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', dataStr, parseError);
            }
          }
        }
      }

      setLoadingMessage('');
      setLoading(false);

    } catch (error: any) {
      // For rate limit errors (429), rethrow without showing error messages
      if (error.status === 429) {
        setLoadingMessage('');
        setLoading(false);
        throw error;
      }

      const errorMessage = error.message || 'Failed to query documentation';
      setError(errorMessage);
      setLoadingMessage('');
      setLoading(false);
      onError(errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    loadingMessage,
    checkHealth,
    ingestDocumentation,
    addUrlsToCollection,
    queryDocumentation,
    queryDocumentationStream,
    clearError
  };
}