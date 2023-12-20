import React, { useEffect, useRef, useState } from 'react';
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
  const [stream, setStream] = useState(null);
  const [username, setUsername] = useState('User name'); // Replace 'John Doe' with your default username

  const onStart = () => {
    console.log('Start button clicked');
    // redirect to /videocallPage
    navigate('/videocall');
  };

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userMediaStream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userMediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);


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

      <div className="mlink">
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
