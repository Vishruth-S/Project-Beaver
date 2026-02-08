import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentation } from '../hooks/useDocumentation';
import { createSession, getAllSessions, ChatSession } from '../utils/sessionManager';
import SessionsSidebar from './SessionsSidebar';
import HowItWorksSidebar from './HowItWorksSidebar';
import './NewChatPage.css';

const NewChatPage: React.FC = () => {
  const [urlsText, setUrlsText] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, error, loadingMessage, ingestDocumentation } = useDocumentation();
  const navigate = useNavigate();

  // Get all sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Parse URLs from textarea (one per line)
    const urls = urlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      return;
    }

    if (!collectionName.trim()) {
      return;
    }

    // Sanitize collection name to meet backend requirements
    const sanitizedName = collectionName
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters
      .replace(/^[^a-zA-Z0-9]+/, '') // Remove leading non-alphanumeric
      .replace(/[^a-zA-Z0-9]+$/, '') // Remove trailing non-alphanumeric
      .substring(0, 63); // Limit to 63 characters

    try {
      const result = await ingestDocumentation({
        urls,
        collection_name: sanitizedName
      });
      
      // Create new session with user-provided name
      const session = createSession(
        urls, // Pass all URLs
        result.collection_id,
        collectionName.trim(), // Use the user-provided name
        result.documents_ingested,
        result.pending_urls_count
      );
      
      // Navigate to chat
      navigate(`/chat/${session.sessionId}`);
    } catch (error: any) {
      console.error('Ingestion failed:', error);
    }
  };

  const exampleUrls = `https://docs.stripe.com/api/authentication
https://docs.stripe.com/api/errors
https://docs.stripe.com/api/balance
https://docs.stripe.com/api/charges
https://docs.stripe.com/api/customers`;

  const fillExample = () => {
    setUrlsText(exampleUrls);
    setCollectionName('Stripe API Documentation');
  };

  return (
    <div className="new-chat-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* Mobile Hamburger Menu */}
          <button
            className="hamburger-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          
          <button 
            className="back-button-nav" 
            onClick={() => navigate('/')}
            aria-label="Go back to home"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4L6 10L12 16" />
            </svg>
          </button>
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
        </div>
        <div className="navbar-right">
          <a href="#" className="nav-link">Help</a>
        </div>
      </nav>

      {/* Main Content - 3 Column Layout */}
      <main className="new-chat-main">
        {/* Left Sidebar - Chat Sessions */}
        <SessionsSidebar 
          sessions={sessions}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Middle Column - Main Content */}
        <div className="main-content-column">
          {/* Loading State */}
          {loading ? (
            <div className="loading-section">
              <div className="loader-container">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
              </div>
              <h2 className="loading-title">Processing Documentation</h2>
              <p className="loading-description">{loadingMessage}</p>
              <p className="loading-hint">This usually takes 1-3 minutes...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="page-header">
                <h1 className="page-title">Create New Chat Session</h1>
                <p className="page-description">
                  Add URLs from one or multiple API documentations. Combine different APIs 
                  (like Maps API, Weather API, Payment API) in a single session to ask questions 
                  across all of them.
                </p>
                <div className="page-tip">
                  <strong>💡 Tip:</strong> Include specific pages like{' '}
                  <code>api/getting-started</code>, <code>api/authentication</code>,{' '}
                  <code>api/errors</code> from each API for better results.
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="new-chat-form">
                {/* Collection Name */}
                <div className="form-group">
                  <label htmlFor="collection-name" className="form-label">
                    Collection Name <span className="required">*</span>
                  </label>
                  <input
                    id="collection-name"
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="e.g., Stripe API Documentation"
                    className="form-input"
                    disabled={loading}
                    required
                  />
                  <p className="form-hint">
                    This name will be used to identify your chat session.
                  </p>
                </div>

                {/* URL List Input */}
                <div className="form-group">
                    <label htmlFor="urls-input" className="form-label">
                      Documentation URLs <span className="required">*</span>
                    </label>
                    <textarea
                      id="urls-input"
                      value={urlsText}
                      onChange={(e) => setUrlsText(e.target.value)}
                      placeholder="Enter one URL per line&#10;https://docs.example.com/api/getting-started&#10;https://docs.example.com/api/authentication&#10;https://docs.example.com/api/errors"
                      className="form-textarea"
                      rows={6}
                      disabled={loading}
                      required
                    />
                    <p className="form-hint">
                      Enter one URL per line. Mix and match URLs from different APIs to create a unified knowledge base.
                    </p>
                    <button
                      type="button"
                      onClick={fillExample}
                      className="example-fill-button"
                      disabled={loading}
                    >
                      📋 Fill with Stripe API example
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <div className="error-content">
                      {error.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms of Service */}
                <div className="terms-notice">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{flexShrink: 0}}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <p>
                    Ensure the URLs are publicly accessible. This tool may index URLs for performance. 
                    By submitting you agree to our <a href="#" className="terms-link">Terms of Service</a>.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !urlsText.trim() || !collectionName.trim()}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                      </svg>
                      Create Chat Session
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right Sidebar - How it works */}
        <HowItWorksSidebar />
      </main>

      {/* Footer */}
      <footer className="new-chat-footer">
        <p>Powered by RAG Technology</p>
      </footer>
    </div>
  );
};

export default NewChatPage;
