import React, { useEffect, useRef } from "react";
import Header from "../common/Header";
import AnimatedFooter from "../common/AnimatedFooter";
import Support from "../common/Support";
import Settings from "../common/Settings";
import "./style.css";
import "./menu.css";
import { useNavigate } from "react-router-dom";
import iconImage from "./icon.png";
import logo1 from "./logo1.png";
import logo2 from "./logo2.png";
import logout from "./logout.png";

function MenuPage() {
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const username = sessionStorage.getItem("username"); 

  const onStart = () => {
    navigate("/videocall");
  };

  const onLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("desiredLanguage");
    sessionStorage.removeItem("knownLanguage");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const getVideo = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;

    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };
  
  useEffect(() => {
    getVideo();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
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

      <div className="link">
        <button type="button" className="start1" onClick={onStart}>
          Start
        </button>
        <a
          href="#"
          className="logout1 styled-button"
          onClick={onLogout}
          title="Click to Logout">
          <img src={logout} alt="Logout" />
        </a>
      </div>

      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="videoElement"
      />
      <Support />
      <Settings />
      <div className="footer-container">
        <AnimatedFooter />
        <div className="image-container">
          <div className="top-right">
            <img src={logo1} alt="logo1" />
          </div>
          <div className="bottom-left">
            <img src={logo2} alt="logo2" />
          </div>
        </div>
      </div >
    </div>
  );
}

export default MenuPage;
