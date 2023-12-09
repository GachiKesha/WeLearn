import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './menu.css';
import settingLogo from './settingLogo.png';
import userIcon from './userIcon.png';
import { useNavigate } from 'react-router-dom';

function MenuPage() {
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const peerRef = useRef();
  const [peerId, setPeerId] = useState(null);

  const onStart = () => {
    console.log('Start button clicked');
    // redirect to /videocallPage
    navigate('/videocall');
  };

  const initializePeer = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      peerRef.current = new Peer();

      peerRef.current.on('open', (id) => {
        setPeerId(id);
      });

      peerRef.current.on('call', handleIncomingCall);
      // Connect to signaling server or perform other setup if needed
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  useEffect(() => {
    initializePeer();

    return () => {
      // Additional cleanup or resource release if needed
    };
  }, []);

  const handleIncomingCall = (call) => {
    // Handle incoming call if needed
  };

  return (
    <div>
      <Header />
      <div className='setting'>
        <a href="#">
          <img src={settingLogo} alt="Setting Logo" />
        </a>
      </div>
      <div className="box flex">
        <div className="user-info">
          <img className="user-icon" src={userIcon} alt="User Icon" />
          <div className="user-name">
            <p>User name</p>
          </div>
        
        </div>
      </div>

      <div className="link">
        <button type="button" className="start1" onClick={onStart}>
          ▶
        </button>
      </div>

      <video ref={localVideoRef} autoPlay playsInline muted className="videoElement" />

      <Support />
    </div>
  );
}

export default MenuPage;
