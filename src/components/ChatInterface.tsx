import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useDocumentation, MAX_HISTORY_MESSAGES } from '../hooks/useDocumentation';
import { getSession, getAllSessions, addMessageToSession, updateSessionUrls, Message, ChatSession } from '../utils/sessionManager';
import { AddUrlsModal } from './AddUrlsModal';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [isAddUrlsModalOpen, setIsAddUrlsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rate limit state
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const MAX_INPUT_LENGTH = 3000;
  const RATE_LIMIT_STORAGE_KEY = 'chatRateLimitExpiresAt';
  
  const { loading, error, queryDocumentationStream, addUrlsToCollection, clearError } = useDocumentation();

  // Rate limit localStorage functions
  const setRateLimitInStorage = (expiresAt: number) => {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, expiresAt.toString());
    setIsRateLimited(true);
  };

  const getRateLimitFromStorage = (): number | null => {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!stored) return null;
    const expiresAt = parseInt(stored, 10);
    if (isNaN(expiresAt)) return null;
    // Check if expired
    if (Date.now() >= expiresAt) {
      localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
      return null;
    }
    return expiresAt;
  };

  const clearRateLimitFromStorage = () => {
    localStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
    setIsRateLimited(false);
    setTimeRemaining('');
  };

  const formatTimeRemaining = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  };

  // Check for rate limit on mount and set up timer
  useEffect(() => {
    const expiresAt = getRateLimitFromStorage();
    if (expiresAt) {
      setIsRateLimited(true);
    }

    // Set up interval to update countdown and check expiry
    const interval = setInterval(() => {
      const storedExpiresAt = getRateLimitFromStorage();
      
      if (!storedExpiresAt) {
        // Rate limit has expired
        if (isRateLimited) {
          clearRateLimitFromStorage();
        }
        return;
      }

      const now = Date.now();
      const remaining = storedExpiresAt - now;

      if (remaining <= 0) {
        clearRateLimitFromStorage();
      } else {
        setTimeRemaining(formatTimeRemaining(remaining));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isRateLimited]);

  // Load session from localStorage
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const loadedSession = getSession(sessionId);
    if (!loadedSession) {
      console.error('Session not found:', sessionId);
      navigate('/');
      return;
    }

    setSession(loadedSession);
    setMessages(loadedSession.messages);
    setAllSessions(getAllSessions());
  }, [sessionId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSources = (messageId: string) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading || !session || input.length > MAX_INPUT_LENGTH || isRateLimited) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    addMessageToSession(sessionId!, userMessage);
    
    const currentInput = input;
    setInput('');

    // Create placeholder assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      text: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Build conversation history from last N messages
      const conversationHistory = messages
        .slice(-MAX_HISTORY_MESSAGES)
        .map(msg => ({
          role: msg.type as 'user' | 'assistant',
          content: msg.text
        }));

      let streamedText = '';

      // Use streaming API
      await queryDocumentationStream(
        session.collectionId,
        currentInput,
        // onToken - update message in real-time
        (token: string) => {
          streamedText += token;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, text: streamedText }
              : msg
          ));
        },
        // onMetadata - add sources when received
        (metadata) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { 
                  ...msg, 
                  isStreaming: false,
                  confidence: metadata.confidence,
                  sources: metadata.sources,
                  lazyLoaded: metadata.lazyLoaded,
                  suggestedUrls: metadata.suggestedUrls
                }
              : msg
          ));

          // Save final message to session
          const finalMessage: Message = {
            id: assistantMessageId,
            type: 'assistant',
            text: streamedText,
            timestamp: new Date().toISOString(),
            confidence: metadata.confidence,
            sources: metadata.sources,
            lazyLoaded: metadata.lazyLoaded,
            suggestedUrls: metadata.suggestedUrls
          };
          addMessageToSession(sessionId!, finalMessage);
        },
        // onError
        (errorMsg: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { 
                  ...msg, 
                  text: `Sorry, I encountered an error: ${errorMsg}. Please try again or check if the backend is running.`,
                  isStreaming: false
                }
              : msg
          ));
        },
        // onDone
        () => {
          // Stream complete
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ));
        },
        false,
        conversationHistory
      );
    } catch (error: any) {
      // Check if this is a 429 rate limit error
      if (error.status === 429) {
        // Set rate limit for 1 hour from now
        const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour in milliseconds
        setRateLimitInStorage(expiresAt);
        
        // Clear any error messages
        clearError();
        
        // Remove the streaming message
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        return;
      }

      const errorMessage: Message = {
        id: assistantMessageId,
        type: 'assistant',
        text: `Sorry, I encountered an error: ${error.message}. Please try again or check if the backend is running.`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? errorMessage : msg
      ));
      addMessageToSession(sessionId!, errorMessage);
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleNewCollection = () => {
    navigate('/new');
  };

  const handleSessionClick = (clickedSessionId: string) => {
    if (clickedSessionId !== sessionId) {
      navigate(`/chat/${clickedSessionId}`);
    }
  };

  const handleAddUrls = async (urlsWithLabel: Record<string, string[]>) => {
    if (!session) return;

    try {
      const result = await addUrlsToCollection(session.collectionId, urlsWithLabel);
      
      // Update session with new URLs and document count
      const updatedSession = updateSessionUrls(
        sessionId!,
        urlsWithLabel,
        result.total_documents
      );

      if (updatedSession) {
        setSession(updatedSession);
      }

      // Close modal
      setIsAddUrlsModalOpen(false);

      // Show success message
      const successMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `✅ Successfully added ${result.urls_added} URL(s) with ${result.documents_ingested} new documents. Total documents in collection: ${result.total_documents}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, successMessage]);
      addMessageToSession(sessionId!, successMessage);

    } catch (error: any) {
      // Show error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `❌ Failed to add URLs: ${error.message}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      addMessageToSession(sessionId!, errorMessage);
    }
  };

  // Helper function to extract readable name from URL
  const getUrlDisplayName = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathSegments.length === 0) {
        return urlObj.hostname;
      }
      
      // Get last meaningful segment
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // Clean up common patterns
      if (lastSegment.includes('.html')) {
        return lastSegment.replace('.html', '');
      }
      
      // Capitalize and format
      return lastSegment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (err) {
      return 'Document';
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  // Get starter questions based on example type
  const getStarterQuestions = (): Array<{ label: string; prompt: string }> => {
    switch (session.exampleType) {
      case 'zoom-calendar':
        return [
          {
            label: 'Create a zoom meeting and add to calendar?',
            prompt: 'Show me how I can create a new Zoom meeting and then add its meeting link to a Google Calendar event. Walk me through both APIs.'
          },
          {
            label: 'How do I create a Zoom meeting?',
            prompt: 'Show me how to create a new Zoom meeting using the Zoom API. Include details about authentication and required parameters.'
          },
          {
            label: 'How do I add an event to Google Calendar?',
            prompt: 'How can I add a new event to Google Calendar using the Calendar API? What are the required fields and authentication steps?'
          },
        ];
      case 'github-slack':
        return [
          {
            label: 'How to send a slack message when PR is merged',
            prompt: 'I want to send a message to a Slack channel whenever a pull request is merged in GitHub. Can you show me how using the GitHub API and the slack web API to do this?'
          },
          {
            label: 'How do I authenticate with GitHub?',
            prompt: 'Explain how to authenticate with the GitHub API. What are the different authentication methods available?'
          },
          {
            label: 'Create a new channel in slack',
            prompt: 'How do I create a new channel in Slack using the Slack API?'
          }
        ];
      case 'weather-api':
        return [
          {
            label: 'How to get current weather of a city?',
            prompt: 'Show me how to get the current weather of a city using the Weather APIs'
          },
          {
            label: 'How to get 7-day forecast?',
            prompt: 'Show me how to get a 7-day weather forecast using the Weather APIs'
          },
          {
            label: 'How to get historical weather data?',
            prompt: 'How to get historical weather data? Show me how to retrieve historical weather data for a specific date and location using the Weather APIs.'
          }
        ];
      default:
        return [
          {
            label: 'How to get started with this API?',
            prompt: 'I just loaded this documentation. What are the first steps I should take to start using this API?'
          },
          {
            label: 'What are the rate limits?',
            prompt: 'What are the rate limits for this API? How many requests can I make per hour and how should I handle rate limit errors?'
          },
          {
            label: 'How do I handle errors?',
            prompt: 'What are the common error codes in this API and how should I handle them? Provide examples of error responses and best practices.'
          }
        ];
    }
  };

  const starterQuestions = getStarterQuestions();

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <button className="back-button" onClick={handleBackToLanding} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>
        <div className="chat-header-info">
          <h2 className="chat-title">{session.name}</h2>
          <p className="chat-subtitle">
            {session.documentCount} pages
          </p>
        </div>
        <div className="chat-header-actions">
          {/* <a 
            href={session.url}
            target="_blank"
            rel="noopener noreferrer"
            className="docs-link-button"
            title="View original documentation"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9v5H2V2h5M10 2h4v4M7 9l7-7"/>
            </svg>
            Go to Docs
          </a> */}
          <button 
            className="icon-button" 
            onClick={handleNewCollection}
            aria-label="New collection"
            title="Start with new documentation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="4" x2="10" y2="16"/>
              <line x1="4" y1="10" x2="16" y2="10"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="chat-body">
        {/* Left Sidebar - Sessions List */}
        <aside className="left-sidebar">
          <div className="sidebar-header">
            <h3>Chat Sessions</h3>
            <button 
              className="new-chat-icon-button"
              onClick={handleNewCollection}
              title="New chat session"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          <div className="sidebar-content">
            {allSessions.length === 0 ? (
              <div className="no-sessions">
                <p>No chat sessions yet</p>
              </div>
            ) : (
              allSessions
                .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                .map((sess) => (
                  <button
                    key={sess.sessionId}
                    className={`session-item ${sess.sessionId === sessionId ? 'active' : ''}`}
                    onClick={() => handleSessionClick(sess.sessionId)}
                    title={sess.name}
                  >
                    <div className="session-item-name">{sess.name || 'Untitled Chat'}</div>
                    <div className="session-item-meta">
                      {sess.messages.length} {sess.messages.length === 1 ? 'msg' : 'messages'}
                    </div>
                  </button>
                ))
            )}
          </div>
        </aside>

        {/* Middle - Chat Messages */}
        <main className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="32" cy="32" r="28"/>
                <path d="M22 28h4m12 0h4M22 40s4 4 10 4 10-4 10-4"/>
              </svg>
            </div>
            <h3>Start a conversation</h3>
            <p>Ask questions about {session.name}</p>
            <div className="suggested-questions">
              {starterQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="suggestion-chip"
                  onClick={() => setInput(question.prompt)}
                >
                  {question.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`message ${message.type}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? (
                    <div className="avatar-user">You</div>
                  ) : (
                    <div className="avatar-assistant">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="10" cy="10" r="8"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="message-content">
                  {message.type === 'user' ? (
                    <div className="message-text">{message.text}</div>
                  ) : (
                    <div className="message-text markdown-content">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                      {message.isStreaming && (
                        <div className="typing-indicator" style={{ display: 'inline-flex', marginLeft: '4px', verticalAlign: 'middle' }}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Sources Toggle Button */}
                  {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="sources-toggle-container">
                      <button 
                        className="sources-toggle-inline"
                        onClick={() => toggleSources(message.id)}
                      >
                        <span>Sources ({message.sources.length})</span>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          className={expandedSources.has(message.id) ? 'expanded' : ''}
                        >
                          <path d="M4 6L8 10L12 6" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Lazy Loaded Badge */}
                  {message.lazyLoaded && (
                    <div className="lazy-load-badge">
                      📚 Fetched additional documentation
                    </div>
                  )}

                  {/* Sources List - Collapsible */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="sources">
                      {expandedSources.has(message.id) && (
                        <div className="sources-list">
                          {message.sources.map((source, idx) => (
                            <div key={idx} className="source-item">
                              <div className="source-header">
                                <strong className="source-title">
                                  {source.section || 'Documentation'}
                                </strong>
                              </div>
                              <a 
                                href={source.source} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="source-link"
                              >
                                View docs →
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggested URLs */}
                  {message.suggestedUrls && message.suggestedUrls.length > 0 && (
                    <div className="suggested-urls">
                      <h4>💡 Want more details? Check these pages:</h4>
                      <ul>
                        {message.suggestedUrls.map((url, idx) => (
                          <li key={idx}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {loading && !messages.some(msg => msg.isStreaming) && (
              <div className="message assistant loading">
                <div className="message-avatar">
                  <div className="avatar-assistant">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <circle cx="10" cy="10" r="8"/>
                    </svg>
                  </div>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

        {/* Right Sidebar - Source Documents */}
        <aside className="right-sidebar">
          <div className="sidebar-header">
            <h3>Source Pages</h3>
            <button 
              className="add-source-button"
              onClick={() => setIsAddUrlsModalOpen(true)}
              title="Add more sources"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v3h3a1 1 0 110 2H8v3a1 1 0 11-2 0V8H3a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          <div className="sidebar-content">
            {/* Document Stats - Compact */}
            <div className="document-stats-compact">
              <div className="stat-display">
                <span className="stat-number">{session.documentCount}</span>
                <span className="stat-text">pages loaded</span>
              </div>
              {/* {False 0 && (
                <div className="pending-badge">
                  {session.pendingUrls} pending
                </div>
              )} */}
            </div>
            
            {/* Parsing Info Notice */}
            <div className="parsing-notice">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="5"/>
                <path d="M6 3v3m0 1.5v.5"/>
              </svg>
              <span>Content is parsed from URLs. Complex elements like tables may be omitted during extraction.</span>
            </div>

            {/* URLs List */}
            <div className="urls-section">
              <h4 className="urls-header">Indexed Pages</h4>
              <div className="urls-list">
                {(session.urls && session.urls.length > 0) ? (
                  session.urls.map((docUrl, index) => {
                    try {
                      const urlObj = new URL(docUrl);
                      const displayName = getUrlDisplayName(docUrl);
                      const shortPath = urlObj.pathname.length > 35 
                        ? '...' + urlObj.pathname.slice(-32)
                        : urlObj.pathname || '/';
                      
                      return (
                        <div key={index} className="url-item">
                          <div className="url-icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                              <path d="M2 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"/>
                              <path d="M4 4h6v1H4V4zm0 2h6v1H4V6zm0 2h4v1H4V8z" fill="white"/>
                            </svg>
                          </div>
                          <div className="url-info">
                            <div className="url-name" title={displayName}>{displayName}</div>
                            <a 
                              href={docUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="url-link"
                              title={docUrl}
                            >
                              {shortPath}
                            </a>
                          </div>
                        </div>
                      );
                    } catch (err) {
                      return (
                        <div key={index} className="url-item">
                          <div className="url-icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                              <path d="M2 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"/>
                            </svg>
                          </div>
                          <div className="url-info">
                            <div className="url-name">Invalid URL</div>
                            <span className="url-link">{docUrl.substring(0, 40)}...</span>
                          </div>
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="url-item">
                    <div className="url-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M2 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V2z"/>
                        <path d="M4 4h6v1H4V4zm0 2h6v1H4V6zm0 2h4v1H4V8z" fill="white"/>
                      </svg>
                    </div>
                    <div className="url-info">
                      <div className="url-name">Base URL</div>
                      <a 
                        href={session.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="url-link"
                        title={session.url}
                      >
                        {new URL(session.url).hostname}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Input Area */}
      <footer className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          {isRateLimited && (
            <div className="rate-limit-banner">
              <div className="rate-limit-banner-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="10" r="8"/>
                  <path d="M10 6v5l3 2"/>
                </svg>
                <div className="rate-limit-banner-text">
                  <strong>Too many requests.</strong> You have exhausted your limit. Try again in: <strong>{timeRemaining}</strong>
                </div>
              </div>
            </div>
          )}
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isRateLimited ? "Rate limited - please wait..." : "Ask a question..."}
              className={`chat-input ${input.length > MAX_INPUT_LENGTH ? 'over-limit' : ''}`}
              rows={1}
              disabled={loading || isRateLimited}
              maxLength={MAX_INPUT_LENGTH + 100}
            />
            <div className="input-actions">
              <div className={`character-count ${input.length > MAX_INPUT_LENGTH ? 'over-limit' : input.length > MAX_INPUT_LENGTH * 0.9 ? 'warning' : ''}`}>
                {input.length} / {MAX_INPUT_LENGTH}
              </div>
              <button 
                type="submit" 
                className="send-button"
                disabled={!input.trim() || loading || input.length > MAX_INPUT_LENGTH || isRateLimited}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10L18 2L10 18L8 11L2 10Z"/>
                </svg>
              </button>
            </div>
          </div>
          {input.length > MAX_INPUT_LENGTH && (
            <p className="input-error">
              ⚠️ Message exceeds maximum length of {MAX_INPUT_LENGTH} characters. Please shorten your message.
            </p>
          )}
          {error && !isRateLimited && (
            <p className="input-error">
              ⚠️ {error}
            </p>
          )}
          {!isRateLimited && (
            <p className="input-hint">
              Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
            </p>
          )}
        </form>
      </footer>

      {/* Add URLs Modal */}
      <AddUrlsModal
        isOpen={isAddUrlsModalOpen}
        onClose={() => setIsAddUrlsModalOpen(false)}
        onSubmit={handleAddUrls}
        isLoading={loading}
      />
    </div>
  );
};

export default ChatInterface;