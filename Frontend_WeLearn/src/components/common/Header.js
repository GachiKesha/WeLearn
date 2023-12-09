import { Link } from 'react-router-dom';
import React from 'react';
import styles from './Header.css';

const Header = () => {
  return (
    <div> 
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Lora&family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,800;1,6..12,1000&display=swap"
        rel="stylesheet"/>
      <h1 className={styles.h1Container}><Link to="/start">WeLearn</Link></h1>
    </div>
  );
};

export default Header;