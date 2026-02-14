import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>
        Made with <span className="heart">♥</span> by{' '}
        <a 
          href="https://www.vishruths.me/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="footer-link"
        >
          Vishruth
        </a>
      </p>
    </footer>
  );
};

export default Footer;
