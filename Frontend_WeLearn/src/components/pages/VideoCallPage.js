import {useEffect, useRef, useState} from "react";
import styles from './VideoCallPage.module.css';
import Peer from "peerjs";
import Header from '../common/Header';
import Support from '../common/Support';
import cameraOn from './cameraOn.png';
import cameraOff from './cameraOff.png';
import next from './next.png';
import setting1 from './setting1.png';
import microOn from './microOn.png';
import microOff from './microOff.png';




function VideoCallPage() {
    
    const [MuteMicrophone, setMuteMicrophone] = useState(false);
    const [CameraOff, setCameraOff] = useState(true);

    const knownLanguage = localStorage.getItem('knownLanguage');
    const desiredLanguage = localStorage.getItem('desiredLanguage');
    const username = localStorage.getItem('username');

    const MicrophoneToggle = () => {
        if (localVideoRef.current) {
          setMuteMicrophone((prev) => !prev);
      
          const localStream = localVideoRef.current.srcObject;
          const audioTracks = localStream.getAudioTracks();
      
          audioTracks.forEach((track) => {
            track.enabled = !MuteMicrophone;
          });
        }
      };
      
      const CameraToggle = () => {
        if (localVideoRef.current) {
          setCameraOff((prev) => !prev);
          const localStream = localVideoRef.current.srcObject;
          const videoTracks = localStream.getVideoTracks();
      
          videoTracks.forEach((track) => {
            track.enabled = !CameraOff;
          });
        }
      };

    let [peerId, setPeerId] = useState('');
    let [targetPeerId, setTargetPeerId] = useState('');

const localVideoRef = useRef(null);
const remoteVideoRef = useRef(null);
const peerRef = useRef(null);



    const handleIncomingCall = (call) => {
        call.answer(localVideoRef.current.srcObject);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
    };

    const callPeer = () => {
        if (!targetPeerId) {
            alert("Please, enter valid target peer id.")
        }

        let call = peerRef.current.call(targetPeerId, localVideoRef.current.srcObject);

        call.on('stream', function(remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        });
    }

    const initializePeer = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;
        peerRef.current = new Peer();
        const token = localStorage.getItem('token')
        peerRef.current.on('open', async(id) => {
          setPeerId(id);
          try {
            const response = await fetch('http://localhost:8000/peer/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
              },
              body: JSON.stringify({
                 peer_id: id
              }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('User data sent successfully:', responseData);

        setTargetPeerId(responseData.peer_Id);
        peerRef.current.on('call', handleIncomingCall);
        // Connect to signaling server or perform other setup if needed
      } catch (error) {
        console.error('Error sending user data to the backend:', error);
      }
      });
    }
      useEffect(() => {
        initializePeer();
    
        return () => {
          if (peerRef.current) {
            peerRef.current.destroy(); // Закриває підключення Peer при виході
            peerRef.current = null;
          }
    
          if (localVideoRef.current) {
            const localStream = localVideoRef.current.srcObject;
            if (localStream) {
              const tracks = localStream.getTracks();
              tracks.forEach((track) => track.stop()); // Зупиняє відео- та аудіотреки
            }
            localVideoRef.current.srcObject = null;
          }
    
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        };
      }, []);



    return <div>
    <Header />
        <div className={styles.mainContainer}>
            <div className={styles.videosSection}>
                <video className={styles.videoElement} ref={localVideoRef} autoPlay playsInline muted />
                <video className={styles.videoElement} ref={remoteVideoRef} autoPlay playsInline />
            </div>

            <div className={styles.controlsSection}>

                <div>
                    <div>Your Peer ID: {peerId}</div>
                    <div>Known Language: {knownLanguage}</div>
                    <div>Desired Language: {desiredLanguage}</div>
                    <div>Name: {username}</div>
                    <div>
                        <input value={targetPeerId} onChange={(e) => setTargetPeerId(e.target.value)}/>
                        <button className={styles.startCallBtn} onClick={callPeer}>Call</button>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.bottomToolbar}>
            <div className={styles.centerContainer}>
                <a href="#">
                    <img src={setting1} alt="Setting1 Logo"/>
                </a>
                <a href="#" onClick={MicrophoneToggle}>
                    {MuteMicrophone ? 
                        (<img src={microOff} alt="Microphone Off" />) 
                        : (<img src={microOn} alt="Microphone On"/>)
                    }
                </a>
                <a href="#" onClick={CameraToggle}>
                    {CameraOff ? 
                        (<img src={cameraOn} alt="Camera On" />) 
                        : (<img src={cameraOff} alt="Camera Off"/>)
                    }
                </a>
                <a href="#" onClick={initializePeer}>
                    <img src={next} alt="Next Logo" />
                </a>
            </div>
        </div>
        
        <Support />
    </div>;
}


export default VideoCallPage;
