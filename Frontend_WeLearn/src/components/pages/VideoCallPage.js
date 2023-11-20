import {useEffect, useRef, useState} from "react";
import styles from './VideoCallPage.module.css';
import Peer from "peerjs";
import Header from '../common/Header';
import Support from '../common/Support';
import settingLogo from './settingLogo.png';
import camera from './camera.png';
import next from './next.png';
import setting1 from './setting1.png';
import micro from './micro.png';


<Header />

function VideoCallPage() {
    

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

        peerRef.current.on('open', (id) => {
            setPeerId(id);
        });

        peerRef.current.on('call', handleIncomingCall);
        // Connect to signaling server or perform other setup if needed
    };

    useEffect(() => {
        initializePeer();

        return () => {
            if (peerRef.current) {
                peerRef.current.disconnect();
                remoteVideoRef.current.srcObject = null;
            }
        };
    }, []); // Run only on component mount and unmount



    return <>
        <Header />
        <div className='setting'>
    <a href="#">
        <img src={settingLogo} alt="Setting Logo" />
      </a>
    </div>
        <div className={styles.mainContainer}>
            <div className={styles.videosSection}>
                <video className={styles.videoElement} ref={localVideoRef} autoPlay playsInline muted />
                <video className={styles.videoElement} ref={remoteVideoRef} autoPlay playsInline />
            </div>

            <div className={styles.controlsSection}>

                <div>
                    <div>Your Peer ID: {peerId}</div>
                    <br/>
                    <br/>
                    <div>
                        <input value={targetPeerId} onChange={(e) => setTargetPeerId(e.target.value)}/>
                        <button className={styles.startCallBtn} onClick={callPeer}>Call</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="center-container">
        <a href="#">
        <img src={setting1} alt="Setting1 Logo" />
      </a>
      <a href="#">
        <img src={micro} alt="Micro Logo" />
      </a>
      <a href="#">
        <img src={camera} alt="Camera Logo" />
      </a>
      <a href="#">
        <img src={next} alt="Next Logo" />
      </a>
        </div>
        
        <Support />
    </>;
}


export default VideoCallPage;
