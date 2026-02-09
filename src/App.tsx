import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NewChatPage from './components/NewChatPage';
import ChatInterface from './components/ChatInterface';
import TermsPage from './components/TermsPage';
import { migrateOldCollection } from './utils/sessionManager';
import './styles/global.css';

const App: React.FC = () => {
  // Migrate old collection format on mount
  useEffect(() => {
    migrateOldCollection();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/new" element={<NewChatPage />} />
          <Route path="/chat/:sessionId" element={<ChatInterface />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;