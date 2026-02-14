import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSessions, ChatSession } from '../utils/sessionManager';
import SessionsSidebar from './SessionsSidebar';
import HowItWorksSidebar from './HowItWorksSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Load sessions on mount
  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  const handleNewChat = () => {
    navigate('/new');
  };

  return (
    <div className="landing-page">
      <Navbar 
        showHamburger={true} 
        onHamburgerClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content - 3 Column Layout */}
      <main className="landing-main">
        {/* Left Sidebar - Chat Sessions */}
        <SessionsSidebar 
          sessions={sessions}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Middle Column - Welcome & New Chat */}
        <div className="main-content-column">
          <div className="welcome-section">
            <div className="welcome-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="40" cy="40" r="35"/>
                <path d="M28 48s4 8 12 8 12-8 12-8"/>
                <circle cx="30" cy="32" r="3" fill="currentColor"/>
                <circle cx="50" cy="32" r="3" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="welcome-title">Welcome!</h1>
            <p className="welcome-subtitle">Multi-API Documentation ChatBot</p>
          </div>

          <div className="new-chat-section">
            <p className="new-chat-text">
              {sessions.length > 0 
                ? 'Ready to start a new conversation?' 
                : 'Get started by creating your first chat session'}
            </p>
            <button onClick={handleNewChat} className="new-chat-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Create New Chat
            </button>
          </div>
        </div>

        {/* Right Sidebar - How it works */}
        <HowItWorksSidebar />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;