import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Header from '../common/Header';
import AnimatedFooter from '../common/AnimatedFooter';
import Support from '../common/Support';
import './style.css';
import './menu.css';
import { useNavigate } from 'react-router-dom';
import iconImage from './icon.png'; 

function MenuPage() {
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const peerRef = useRef();
  const [peerId, setPeerId] = useState(null);
  const [username, setUsername] = useState('User name'); // Replace 'John Doe' with your default username

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
      <div className="box flex">
        <div className="icon-container">
        <div className="user-name">
            <p>{username}</p>
          </div>
          <img className="icon" src={iconImage} alt="Icon" />
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
