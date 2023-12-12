import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../common/Header';
import AnimatedFooter from '../common/AnimatedFooter';
import Support from '../common/Support';
import './style.css';
import './start.css';
import settingLogo from './settingLogo.png';

function StartPage() {
  const navigate = useNavigate();
  const [fieldValue, setFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [startButtonClicked, setStartButtonClicked] = useState(false);

  const onStart = () => {
    setStartButtonClicked(true); 
    const trimmedFieldValue = fieldValue.trim();
    const langChoice = document.querySelector('.lang-choice').value;
    const desLangChoice = document.querySelector('.des-lang-choice').value;
  
    if (trimmedFieldValue === '' && (langChoice === desLangChoice)) {
      setErrorMessage('Please fill in the field before starting and choose different languages.');
    } else if (trimmedFieldValue === '') {
      setErrorMessage('Please fill in the field before starting.');
    } else if (langChoice === desLangChoice) {
      setErrorMessage('Please choose different languages.');
    } else {
      console.log('Start button clicked');
      // redirect to /videocallPage
      navigate('/videocall');
    }
  };

  const handleFieldChange = (event) => {
    setFieldValue(event.target.value);
    // clear error message when the field changes
    setErrorMessage('');
  };

  return (
    <div>
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
      <input type="text" id="Name" placeholder="Name"required value={fieldValue} onChange={handleFieldChange} />
      {/* display error message*/}
      {startButtonClicked && fieldValue === '' && (
        <div className="error-message">Please enter your name.</div>)}
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="link">
              <button type="button" className="start" onClick={onStart}>
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      <Support />
      <AnimatedFooter/>
    </div>
  );
}

export default StartPage;
