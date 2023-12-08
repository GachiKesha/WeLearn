import React from 'react';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './menu.css';
import settingsLogo from './settingLogo.png';
import userIcon from './userIcon.png';
import startLogo from './startLogo.png';

function MenuPage() {
  return (
    
    <div>
    
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link
  href="https://fonts.googleapis.com/css2?family=Lora&family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,800;1,6..12,1000&display=swap"
  rel="stylesheet"
/>

    
        <Header />
        <div className="container flex">
          <div className="user-info">
            <img src={userIcon} alt="User Icon" />
            <div className="user-name">
              <p>User name</p>
            </div>
            <a href="##">
              <img src={settingsLogo} alt="Settings" />
            </a>
          </div>
          <div className="post">
            <div className="video-start">
              <a href="##">
                <img src={startLogo} alt="Start" />
              </a>
            </div>
          </div>
        </div>
        <Support />
    </div>
  );
}

export default MenuPage;
