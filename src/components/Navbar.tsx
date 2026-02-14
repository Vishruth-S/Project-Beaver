import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  showHamburger?: boolean;
  showBackButton?: boolean;
  onHamburgerClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showHamburger = false, 
  showBackButton = false,
  onHamburgerClick 
}) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Mobile Hamburger Menu */}
        {showHamburger && (
          <button
            className="hamburger-button"
            onClick={onHamburgerClick}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        
        {/* Back Button */}
        {showBackButton && (
          <button 
            className="back-button-nav" 
            onClick={() => navigate('/')}
            aria-label="Go back to home"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4L6 10L12 16" />
            </svg>
          </button>
        )}
        
        <div className="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <div className="nav-brand">
          <span className="brand-name">APItome</span>
          <span className="brand-preview">[Preview]</span>
        </div>
      </div>
      <div className="navbar-right">
        <button 
          className="about-button"
          onClick={() => navigate('/about')}
        >
          About
        </button>
        <button 
          className="demo-button"
          onClick={() => navigate('/demo')}
        >
          Demo
        </button>
        <a 
          href="https://github.com/Vishruth-S/Project-Beaver/issues" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-button"
          aria-label="Report an issue on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
