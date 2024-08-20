import { useEffect, useRef, useState } from "react";
import styles from "./VideoCallPage.module.css";
import Peer from "peerjs";
import Header from "../common/Header";
import AnimatedFooter from "../common/AnimatedFooter";
import Support from "../common/Support";
import cameraOn from "./cameraOn.png";
import cameraOff from "./cameraOff.png";
import next from "./next.png";
import iconImage from "./icon.png";
import microOn from "./microOn.png";
import microOff from "./microOff.png";
import user1Image from "./user1.png";
import user2Image from "./user2.png";

function VideoCallPage() {
  const [MuteMicrophone, setMuteMicrophone] = useState(false);
  const [CameraOff, setCameraOff] = useState(true);
  const [isUserActive, setIsUserActive] = useState(false);

  const [oppUsername, setTargetUsername] = useState("");

  const [peerId, setPeerId] = useState(null);
  const [targetPeerId, setTargetPeerId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const previousRef = useRef("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peer = useRef(null);

  const firstRender = useRef(true);

  const knownLanguage = sessionStorage.getItem("knownLanguage");
  const desiredLanguage = sessionStorage.getItem("desiredLanguage");
  const username = sessionStorage.getItem("username");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
    call.answer(localVideoRef.current.srcObject);
    call.on('stream', (remoteStream) => {
      setIsConnected(true);
      remoteVideoRef.current.srcObject = remoteStream;
    });
    call.on('close', () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setIsConnected(false);
      setTargetUsername(null);
    });
    peer.current.on('connection', (conn) => {
      conn.on('data', (data) => {
        if(data === 'ping') {
          console.log('pong');
          return;
        }  
        setTargetUsername(data);
      });

      conn.on('close', handlePeerDisconnect);
    });    
  };

  const handlePeerDisconnect = () => {
    console.log('Peer disconnected');
    setIsConnected(false);
    setTargetUsername(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const callPeer = () => {
    if (!targetPeerId) {
      console.warn('No target peer id.');
      return;
    }

    const localStream = localVideoRef.current.srcObject;
    if (!localStream) {
      console.warn('Local stream is not available');
      return;
    }

    const call = peer.current.call(targetPeerId, localStream);
    const conn = peer.current.connect(targetPeerId);

    conn.on('open', () => {      
      conn.send(username);
    });

    conn.on('data', (data) => {
      if (data === 'ping') {
        console.log('pong');
      }
    })

    call.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
      setIsConnected(true);
    });

    call.on('close', () => {
      if (remoteVideoRef.current !== null) {
        remoteVideoRef.current.srcObject = null;
      }
      setIsConnected(false);
      setTargetUsername(null);
    });
  };

  const initializePeer = async () => {
    try {
      if (peer.current) {
        peer.current.destroy();
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;

      peer.current = new Peer();
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      peer.current.on('open', async (id) => {
        setPeerId(id);
        try {
          const response = await fetch(`${backendUrl}/peer/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              peer_id: id,
              previous: peerId,
            }),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseData = await response.json();
          if (response.status === 200) {
            setTargetPeerId(responseData.peer_id);
            setTargetUsername(responseData.username);    
          }
          else if (response.status === 201) {
            peer.current.on('call', handleIncomingCall);
          } 
          setIsUserActive(true);
        } catch (error) {
          console.error('Peer setup error:', error);
        }
        previousRef.current = id;
      });
      
      peer.current.on('error', (err) => {
        console.error('Peer error:', err);
      });
      
      peer.current.on('disconnected', () => {
        console.log('Peer disconnected');
        setIsUserActive(false);        
        Object.values(peer.current.connections).forEach(connectionArray => {
          connectionArray.forEach(connection => {
            console.warn('connection:', connection);
            connection.close();
          })
        })
        peer.current.destroy();
      })
    } catch (error) {
      console.error('Error initializing peer:', error);
    };
  };  

  useEffect(() => {
    if (firstRender.current) { // StrictMode crutch 
      firstRender.current = false;
      return;
    }
    initializePeer().then(() => console.warn('peer initialized.'));
    
    return () => {
      fetchInactiveUser(true);
      if (peer.current) {      
        peer.current.destroy();
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
    if (firstRender.current) { // StrictMode crutch 
      firstRender.current = false;
      return;
    }
    if (targetPeerId) {
      callPeer();
    }
    else {
      console.warn('No target peer id');
    }
  }, [targetPeerId]);
  
  const fetchInactiveUser = async (_delete) => {
    if (!peer.current || !peer.current.id) {
      console.warn('Peer ID is not available');
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/ping_peer/${peer.current?.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          delete: _delete
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 200) {
        const responseData = await response.json();
        console.log('in call:', responseData.target_peer_id != null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (firstRender.current) { // StrictMode crutch 
      firstRender.current = false;
      return;
    }

    const checkActivity = setInterval(() => {
      if (isUserActive) {
        fetchInactiveUser(false);
        Object.values(peer.current.connections).forEach(connectionArray => {
          connectionArray.forEach(connection => {
            if (connection.open && typeof connection.send === 'function') {
              connection.send('ping');
              console.log('ping');
            }
          });
        });        
      }
      else {
        console.warn('No interval for innactive user');
      }
    }, 6000);      
 
    return () => {
      clearInterval(checkActivity);
    };
  }, [isUserActive]);

  return (
    <div>
      <Header />
        <div className="icon-container">
          <div className="user-name">
            <p>{username}</p>
          </div>
          <img className="icon" src={iconImage} alt="Icon" />
        </div>
      
      <div className={styles.mainContainer}>
        <div className={styles.videosSection}>
          <video
            className={`${styles.videoElement1} ${
              CameraOff ? styles.backgroundImage : user1Image
            }`}
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          />
          <video
            className={`${styles.videoElement2} ${
              CameraOff ? styles.backgroundImage : user2Image
            }`}
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />
        </div>        
        <div className={styles.controlsSection}>
          <div>
            <div>Username: {username}</div>
            {isConnected && oppUsername && <div>Stranger: {oppUsername}</div>}
            <div>Known Language: {knownLanguage}</div>
            <div>Desired Language: {desiredLanguage}</div>
          </div>
        </div>
      </div>
      <div className={styles.bottomToolbar}>
        <div className={styles.centerContainer}>
          <a href="#" onClick={toggleMicrophone}>
            {MuteMicrophone ? (
              <img src={microOff} alt="Microphone Off" />
            ) : (
              <img src={microOn} alt="Microphone On" />
            )}
          </a>
          <a href="#" onClick={toggleCamera}>
            {CameraOff ? (
              <img src={cameraOn} alt="Camera On" />
            ) : (
              <img src={cameraOff} alt="Camera Off" />
            )}
          </a>
          <a href="#" onClick={initializePeer}>
            <img src={next} alt="Next Logo" />
          </a>
        </div>
      </div>
      <Support />
      <AnimatedFooter />
    </div>
  );
}

export default VideoCallPage;
