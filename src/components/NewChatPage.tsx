import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocumentation } from '../hooks/useDocumentation';
import { createSession, getAllSessions, ChatSession } from '../utils/sessionManager';
import SessionsSidebar from './SessionsSidebar';
import HowItWorksSidebar from './HowItWorksSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import './NewChatPage.css';
import funFacts from '../utils/funfacts.json';

interface ApiInput {
  id: number;
  label: string;
  urls: string;
}

interface ExampleData {
  id: string;
  name: string;
  collectionName: string;
  apis: ApiInput[];
}

const NewChatPage: React.FC = () => {
  const [collectionName, setCollectionName] = useState('');
  const [apiInputs, setApiInputs] = useState<ApiInput[]>([
    { id: 1, label: '', urls: '' }
  ]);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [randomFunFact, setRandomFunFact] = useState<string>('');
  const { loading, error, loadingMessage, ingestDocumentation } = useDocumentation();
  const navigate = useNavigate();

  // Get all sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  // Select random fun fact when loading starts
  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * funFacts.length);
      setRandomFunFact(funFacts[randomIndex]);
    }
  }, [loading]);

  const addApiInput = () => {
    const newId = Math.max(...apiInputs.map(api => api.id), 0) + 1;
    setApiInputs([...apiInputs, { id: newId, label: '', urls: '' }]);
    // Clear selected example if user manually adds API inputs
    if (selectedExample) {
      setSelectedExample(null);
    }
  };

  const removeApiInput = (id: number) => {
    if (apiInputs.length > 1) {
      setApiInputs(apiInputs.filter(api => api.id !== id));
      // Clear selected example if user manually removes API inputs
      if (selectedExample) {
        setSelectedExample(null);
      }
    }
  };

  const updateApiInput = (id: number, field: 'label' | 'urls', value: string) => {
    setApiInputs(apiInputs.map(api => 
      api.id === id ? { ...api, [field]: value } : api
    ));
    // Clear selected example if user manually modifies inputs
    if (selectedExample) {
      setSelectedExample(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Validate collection name
    if (!collectionName.trim()) {
      return;
    }

    // Build urls_with_label object
    const urlsWithLabel: Record<string, string[]> = {};
    
    for (const apiInput of apiInputs) {
      const label = apiInput.label.trim();
      const urls = apiInput.urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      // Skip empty API inputs
      if (!label || urls.length === 0) {
        continue;
      }

      urlsWithLabel[label] = urls;
    }

    // Validate that at least one API has been entered
    if (Object.keys(urlsWithLabel).length === 0) {
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
        urls_with_label: urlsWithLabel,
        collection_name: sanitizedName
      });
      
      // Create new session with user-provided name
      const session = createSession(
        urlsWithLabel,
        result.collection_id,
        collectionName.trim(),
        result.documents_ingested,
        result.pending_urls_count,
        selectedExample || undefined
      );
      
      // Navigate to chat
      navigate(`/chat/${session.sessionId}`);
    } catch (error: any) {
      console.error('Ingestion failed:', error);
    }
  };

  // Define example datasets
  const examples: ExampleData[] = [
    {
      id: 'zoom-calendar',
      name: 'Zoom + Google Calendar',
      collectionName: 'Meeting Management APIs',
      apis: [
        {
          id: 1,
          label: 'Google Calendar API',
          urls: `https://developers.google.com/workspace/calendar/api/v3/reference
https://developers.google.com/workspace/calendar/api/v3/reference/events
https://developers.google.com/workspace/calendar/api/v3/reference/calendars`
        },
        {
          id: 2,
          label: 'Zoom API',
          urls: `https://developers.zoom.us/docs/api/meetings/#tag/meetings/post/users/{userId}/meetings
https://developers.zoom.us/docs/api/`
        },

      ]
    },
    {
      id: 'github-slack',
      name: 'GitHub + Slack',
      collectionName: 'Github and Slack APIs',
      apis: [
        {
          id: 1,
          label: 'Slack API',
          urls: `https://docs.slack.dev/apis/web-api/`
        },
        {
          id: 2,
          label: 'GitHub API',
          urls: `https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28
https://docs.github.com/en/rest/quickstart?apiVersion=2022-11-28`
        }
      ]
    },
    {
      id: 'weather-api',
      name: 'Open Weather API',
      collectionName: 'Open Weather API',
      apis: [
        {
          id: 1,
          label: 'Open Weather API',
          urls: `https://openweathermap.org/api/one-call-3?collection=one_call_api_3.0`
        },
      ]
    }
  ];

  const fillExample = (example: ExampleData) => {
    setCollectionName(example.collectionName);
    setApiInputs(example.apis);
    setSelectedExample(example.id);
  };

  return (
    <div className="new-chat-page">
      <Navbar 
        showHamburger={true} 
        showBackButton={true}
        onHamburgerClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

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
              <p className="loading-hint">This may take a few minutes</p>
              
              {randomFunFact && (
                <div className="fun-fact-container">
                  <p className="fun-fact-header">💡 Here's a totally random fun fact while you wait:</p>
                  <p className="fun-fact-text">{randomFunFact}</p>
                </div>
              )}
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
                  <strong>💡 Tip:</strong> Include all relevant specific pages like{' '}
                  <code>api/getting-started</code>, <code>api/authentication</code>,{' '}
                  <code>api/errors</code> for better results.
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
                    placeholder="e.g., Payment APIs Collection"
                    className="form-input"
                    disabled={loading}
                    required
                  />
                  <p className="form-hint">
                    This name will be used to identify your chat session.
                  </p>
                </div>

                {/* API Inputs */}
                <div className="api-inputs-container">
                  <div className="api-header-row">
                    <label className="form-label">
                      API Documentation <span className="required">*</span>
                    </label>
                    
                    <div className="examples-section-inline">
                      <p className="examples-label-inline">Fill with example:</p>
                      <div className="example-buttons-inline">
                        {examples.map((example) => (
                          <button
                            key={example.id}
                            type="button"
                            onClick={() => fillExample(example)}
                            className="example-button-inline"
                            disabled={loading}
                          >
                            {example.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {apiInputs.map((apiInput, index) => (
                    <div key={apiInput.id} className="api-input-group">
                      <div className="api-input-header">
                        <span className="api-input-number">API #{index + 1}</span>
                        {apiInputs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeApiInput(apiInput.id)}
                            className="remove-api-button"
                            disabled={loading}
                            aria-label="Remove API"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="api-input-fields">
                        <div className="form-group-inline">
                          <label htmlFor={`api-name-${apiInput.id}`} className="form-label-inline">
                            API Name
                          </label>
                          <input
                            id={`api-name-${apiInput.id}`}
                            type="text"
                            value={apiInput.label}
                            onChange={(e) => updateApiInput(apiInput.id, 'label', e.target.value)}
                            placeholder="e.g., Stripe API"
                            className="form-input"
                            disabled={loading}
                          />
                        </div>

                        <div className="form-group-inline">
                          <label htmlFor={`api-urls-${apiInput.id}`} className="form-label-inline">
                            URLs (one per line)
                          </label>
                          <textarea
                            id={`api-urls-${apiInput.id}`}
                            value={apiInput.urls}
                            onChange={(e) => updateApiInput(apiInput.id, 'urls', e.target.value)}
                            placeholder="https://docs.example.com/api/authentication&#10;https://docs.example.com/api/errors&#10;https://docs.example.com/api/webhooks"
                            className="form-textarea"
                            rows={4}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addApiInput}
                    className="add-api-button"
                    disabled={loading}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add More APIs
                  </button>

                  <p className="form-hint">
                    Add multiple APIs to create a unified knowledge base. The AI will distinguish between them when answering questions.
                  </p>
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
                    By submitting you agree to our <Link to="/terms" className="terms-link">Terms of Service</Link>.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !collectionName.trim() || apiInputs.every(api => !api.label.trim() || !api.urls.trim())}
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

      <Footer />
    </div>
  );
};

export default NewChatPage;
