import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSession } from '../utils/sessionManager';
import './SessionsSidebar.css';

interface SessionsSidebarProps {
  sessions: ChatSession[];
  isOpen: boolean;
  onClose: () => void;
}

const SessionsSidebar: React.FC<SessionsSidebarProps> = ({ sessions, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
    onClose();
  };

  return (
    <aside className={`sessions-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h3>Your Chat Sessions</h3>
          <button 
            className="close-sidebar-button"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="16" y2="16"/>
              <line x1="16" y1="4" x2="4" y2="16"/>
            </svg>
          </button>
        </div>
        <div className="sessions-list-scrollable">
          {sessions.length === 0 ? (
            <div className="no-sessions">
              <p>No chat sessions yet</p>
            </div>
          ) : (
            sessions
              .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
              .map((session) => (
                <button
                  key={session.sessionId}
                  className="session-item"
                  onClick={() => handleSessionClick(session.sessionId)}
                >
                  <div className="session-item-name">{session.name}</div>
                  <div className="session-item-meta">
                    {session.messages.length} msg • {session.documentCount} docs
                  </div>
                </button>
              ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default SessionsSidebar;
