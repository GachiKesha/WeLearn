import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "./Header.css";
import logo from "./logo.png";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    setIsAuthenticated(!!authStatus);
  }, []);

  return (
    <div>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora&family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,800;1,6..12,1000&display=swap"
        rel="stylesheet"
      />
      <h1 className={styles.h1Container}>
        {isAuthenticated ? (
          <Link to="/menu">
            <img src={logo} alt="WeLearn Logo" className={styles.logo} />
            WeLearn
          </Link>
        ) : (
          <Link to="/">
            <img src={logo} alt="WeLearn Logo" className={styles.logo} />
            WeLearn
          </Link>
        )}
      </h1>
    </div>
  );
};

export default Header;
