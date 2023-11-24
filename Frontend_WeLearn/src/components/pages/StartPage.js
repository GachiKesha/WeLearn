import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './start.css';
import settingLogo from './settingLogo.png';

function StartPage() {
  const navigate = useNavigate();

  const onStart = () => {
    console.log('Start button clicked');
    // Redirect to /videocallPage
    navigate('/videocall');
  };

  return (
    <>
      <Header />
      <div className='setting'>
        <a href="#">
          <img src={settingLogo} alt="Setting Logo" />
        </a>
      </div>
      <div className="container flex">
        <div className="page flex">
          <div className="post">
            <label htmlFor="Name">Name</label>
            <input type="Name" placeholder="Name" required />
            <label htmlFor="lang-choice">Language to Learn</label>
            <select className="lang-choice">
              <option>English</option>
              <option>Ukrainian</option>
            </select>
            <label htmlFor="des-lang-choice">Native language</label>
            <select className="des-lang-choice">
              <option>Ukrainian</option>
              <option>English</option>
            </select>
            <div className="link">
              <button type="start" className="start" onClick={onStart}>
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      <Support />
    </>
  );
}

export default StartPage;
