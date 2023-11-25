
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToStart = () => {
    console.log('Navigating to /start');
    navigate('/start');
  };

  return (
    <a href="start">
      <h1>WeLearn</h1>
    </a>
  );
};

export default Header;
