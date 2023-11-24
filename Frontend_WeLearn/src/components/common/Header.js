
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToStart = () => {
    console.log('Navigating to /start');
    navigate('/start');
  };

  return (
    <div onClick={handleNavigateToStart}>
      <h1>WeLearn</h1>
    </div>
  );
};

export default Header;
