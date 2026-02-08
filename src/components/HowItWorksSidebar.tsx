import React from 'react';
import './HowItWorksSidebar.css';

const HowItWorksSidebar: React.FC = () => {
  return (
    <aside className="how-it-works-sidebar">
      <div className="info-section">
        <h3 className="info-title">How it works</h3>
        <div className="info-steps">
          <div className="info-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Add URLs</h4>
              <p>Provide URLs from one or multiple API documentations</p>
            </div>
          </div>
          <div className="info-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Wait for Processing</h4>
              <p>System parses and indexes all documentation together</p>
            </div>
          </div>
          <div className="info-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Start Chatting</h4>
              <p>Ask questions across all your APIs in one conversation</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HowItWorksSidebar;
