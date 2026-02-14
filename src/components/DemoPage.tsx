import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './DemoPage.css';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="demo-page">
      <Navbar 
        showHamburger={false}
        showBackButton={true}
      />
      
      <div className="demo-content">
        <h1 className="demo-title">Watch the Demo</h1>
        
        <div className="demo-video-container">
          <iframe
            className="demo-video"
            src="https://www.youtube.com/embed/-PCILB-Am54"
            title="APItome Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DemoPage;
