import {useEffect, useRef, useState} from "react";
import styles from './VideoCallPage.module.css';
import Peer from "peerjs";
import Header from '../common/Header';
import Support from '../common/Support';
import cameraOn from './cameraOn.png';
import cameraOff from './cameraOff.png';
import next from './next.png';
import iconImage from './icon.png'; 
import microOn from './microOn.png';
import microOff from './microOff.png';


function VideoCallPage() {
    const [MuteMicrophone, setMuteMicrophone] = useState(false);
    const [CameraOff, setCameraOff] = useState(true);

    let [peerId, setPeerId] = useState('');
    let [targetPeerId, setTargetPeerId] = useState('');

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);

    const knownLanguage = sessionStorage.getItem('knownLanguage');
    const desiredLanguage = sessionStorage.getItem('desiredLanguage');
    const username = sessionStorage.getItem('username');

    const toggleMicrophone = () => {
        if (localVideoRef.current) {
            setMuteMicrophone((prev) => !prev);
            const localStream = localVideoRef.current.srcObject;
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
        }
    };

    const toggleCamera = () => {
        if (localVideoRef.current) {
            setCameraOff((prev) => !prev);
            const localStream = localVideoRef.current.srcObject;
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
        }
    };

    const handleIncomingCall = (call) => {
    console.log('Someone found us!')
        call.answer(localVideoRef.current.srcObject);
        call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
        });
        call.on('close', () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.remove();
                remoteVideoRef.current = null;
            }
        });
    };

    const callPeer = () => {
        if (!targetPeerId) {
            console.log("Please, enter valid target peer id.");
        }
        let call = peerRef.current.call(targetPeerId, localVideoRef.current.srcObject);
        call.on('stream', function(remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        });
        call.on('close', () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.remove();
                remoteVideoRef.current = null;
            }
        });
    }

    const initializePeer = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;
        peerRef.current = new Peer();
        const token = sessionStorage.getItem('token')
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
                if(response.status==200){
                    console.log('Calling to:', responseData.peer_id);
                    setTargetPeerId(responseData.peer_id);
                    console.log('logs:', targetPeerId);
                }
                if(response.status==201){
                    console.log('Waiting for call...')
                    peerRef.current.on('call', handleIncomingCall);
                }
            } catch (error) {
                console.error('Data sending error:', error);
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

    useEffect(() => {
        if (targetPeerId) {
            callPeer();
        }
    }, [targetPeerId]);

    return <div>
    <Header />
        <div className="icon-container">і
          <img className="icon" src={iconImage} alt="Icon" />
        </div>
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
                <a href="#" onClick={toggleMicrophone}>
                    {MuteMicrophone ? 
                        (<img src={microOff} alt="Microphone Off" />) 
                        : (<img src={microOn} alt="Microphone On"/>)
                    }
                </a>
                <a href="#" onClick={toggleCamera}>
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
