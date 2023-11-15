import {useEffect, useRef, useState} from "react";
import styles from './VideoCallPage.module.css';
import Peer from "peerjs";


function VideoCallPage() {
    let [peerId, setPeerId] = useState(null);
    let [targetPeerId, setTargetPeerId] = useState(null);

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
    </>;
}


export default VideoCallPage;
