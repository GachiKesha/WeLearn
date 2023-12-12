import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import Header from '../common/Header';
import AnimatedFooter from '../common/AnimatedFooter';
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
  const [username, setUsername] = useState(null); // Додайте стан для імені користувача

  useEffect(() => {
    // Отримайте ім'я користувача з localStorage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

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
        <div className="user-info">
          <img className="user-icon" src={userIcon} alt="User Icon" />
          <div className='setting'>
        <a href="#">
          <img src={settingLogo} alt="Setting Logo" />
        </a>
      </div>
          <div className="user-name">

            <p>{username}</p>
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
