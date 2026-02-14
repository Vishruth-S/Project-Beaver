import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './SorryPage.css';

const SorryPage: React.FC = () => {
  return (
    <div className="sorry-page">
      <Navbar showBackButton={true} />
      
      <main className="sorry-content">
        <div className="sorry-container">
          {/* Graphic */}
          <div className="sorry-graphic">
            <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Friendly resting server */}
              <rect x="70" y="60" width="60" height="70" rx="8" fill="#E0F2F1" stroke="#14B8A6" strokeWidth="3"/>
              
              {/* Server rack lines */}
              <line x1="75" y1="75" x2="125" y2="75" stroke="#14B8A6" strokeWidth="2" opacity="0.3"/>
              <line x1="75" y1="85" x2="125" y2="85" stroke="#14B8A6" strokeWidth="2" opacity="0.3"/>
              <line x1="75" y1="95" x2="125" y2="95" stroke="#14B8A6" strokeWidth="2" opacity="0.3"/>
              
              {/* Small indicator lights */}
              <circle cx="80" cy="110" r="3" fill="#10B981"/>
              <circle cx="90" cy="110" r="3" fill="#10B981"/>
              <circle cx="100" cy="110" r="3" fill="#F59E0B"/>
              
              {/* Sleeping eyes */}
              <path d="M85 100 Q88 98 91 100" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M109 100 Q112 98 115 100" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              
              {/* Gentle smile */}
              <path d="M92 115 Q100 118 108 115" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              
              {/* Zzz sleep symbols */}
              <text x="135" y="70" fill="#14B8A6" fontSize="16" fontWeight="bold" opacity="0.7">Z</text>
              <text x="145" y="60" fill="#14B8A6" fontSize="20" fontWeight="bold" opacity="0.5">Z</text>
              <text x="155" y="48" fill="#14B8A6" fontSize="24" fontWeight="bold" opacity="0.3">Z</text>
              
              {/* Coffee cup - taking a break */}
              <ellipse cx="45" cy="145" rx="12" ry="4" fill="#E0F2F1"/>
              <rect x="33" y="130" width="24" height="15" rx="2" fill="#E0F2F1" stroke="#14B8A6" strokeWidth="2"/>
              <path d="M57 135 Q62 135 62 140 Q62 145 57 145" stroke="#14B8A6" strokeWidth="2" fill="none"/>
              
              {/* Steam from coffee */}
              <path d="M38 125 Q38 120 40 120" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              <path d="M45 125 Q45 118 47 118" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              <path d="M52 125 Q52 120 54 120" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              
              {/* Decorative circles */}
              <circle cx="160" cy="140" r="15" fill="#E0F2F1" opacity="0.5"/>
              <circle cx="175" cy="110" r="10" fill="#E0F2F1" opacity="0.3"/>
              <circle cx="25" cy="80" r="12" fill="#E0F2F1" opacity="0.4"/>
            </svg>
          </div>

          {/* Message */}
          <h1 className="sorry-title">Service Temporarily Unavailable</h1>
          <p className="sorry-message">
            We're experiencing exceptionally high traffic right now. Our servers are taking a brief rest to ensure the best experience for everyone.
          </p>
          <p className="sorry-submessage">
            Please check back in a few minutes. We appreciate your patience!
          </p>

          {/* Demo Video Section */}
          <div className="demo-section">
            <h2 className="demo-title">Meanwhile, Watch Our Demo</h2>
            <p className="demo-description">
              See APItome in action and learn how it can help you navigate multiple API documentations effortlessly.
            </p>
            
            <div className="video-container">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="APItome Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            Try Again
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SorryPage;
