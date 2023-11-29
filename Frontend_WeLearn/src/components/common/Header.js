import { Link } from 'react-router-dom';
import React from 'react';
import styles from './Header.css';

const Header = () => {
  return (
    <div> 
      <h1 className={styles.h1Container}><Link to="/start">WeLearn</Link></h1>
    </div>
  );
};

export default Header;
