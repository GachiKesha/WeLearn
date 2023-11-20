import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './start.css';
import settingLogo from './settingLogo.png';

function StartPage() {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <title>WeLearn Start Page</title>
        <link rel="stylesheet" href="./style.css" />
        <link rel="stylesheet" href="./start.css" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora&family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,800;1,6..12,1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
      </body>
    </>
  );
}

function onStart() {
  console.log('Start button clicked');
}

export default StartPage;
