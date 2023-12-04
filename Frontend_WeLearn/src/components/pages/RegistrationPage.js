import React, { useState } from 'react';
import Header from '../common/Header'; 
import Support from '../common/Support';
import './style.css'; 
import './registr.css'; 
import icon from './icon.png'; 

function RegistrationPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mainLanguage, setMainLanguage] = useState('English');
  const [desiredLanguage, setDesiredLanguage] = useState('Ukrainian');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [languageError, setLanguageError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError('Please enter your name.');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!repeatPassword) {
      setRepeatPasswordError('Please repeat your password.');
      isValid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setRepeatPasswordError('');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (mainLanguage === desiredLanguage) {
      setLanguageError('Please choose different desired language.');
      isValid = false;
    } else {
      setLanguageError('');
    }

    return isValid;
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim() !== '') {
      setNameError('');
    }
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim() !== '') {
      setPasswordError('');
    }
  };
  
  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    if (e.target.value.trim() !== '') {
      setRepeatPasswordError('');
    }
  };
  
  const handleEmailChange = (e) => {
    const inputValue = e.target.value.trim();
    setEmail(inputValue);

    if (inputValue !== '') {
      setEmailError('');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputValue)) {
      setEmailError('Please enter a valid email address.');
    }
  };
  
  const handleMainLanguageChange = (e) => {
    setMainLanguage(e.target.value);
    if (e.target.value.trim() !== '') {
      setLanguageError('');
    }
  };
  
  const handleDesiredLanguageChange = (e) => {
    setDesiredLanguage(e.target.value);
    if (e.target.value.trim() !== '') {
      setLanguageError('');
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Registration successful!');
    } else {
      console.log('Registration failed. Please check the form for errors.');
    }
  };
  
  return (
   <div>
        <Header /> 
        <div className="container2 flex">
          <img src={icon} alt="Icon" />
          <div className="page flex">
          <div className="post2">
          <label htmlFor="Name">Name</label>
          <input type="text" placeholder="Name" value={name} onChange={handleNameChange}/>
          <p className="error-message">{nameError}</p>

          <label htmlFor="password">Password</label>
          <input type="password" placeholder="*****************" value={password} onChange={handlePasswordChange}/>
          <p className="error-message">{passwordError}</p>

          <label htmlFor="repeat-password">Repeat password</label>
          <input type="password" placeholder="*****************" value={repeatPassword} onChange={handleRepeatPasswordChange}/>
          <p className="error-message">{repeatPasswordError}</p>

          <label htmlFor="email">Email</label>
          <input type="email" placeholder="mail@abc.com" value={email} onChange={handleEmailChange}/>
          <p className="error-message">{emailError}</p>

          <label htmlFor="lang-choice">Main language(s)</label>
          <select className="lang-choice" value={mainLanguage} onChange={handleMainLanguageChange}>
            <option>English</option>
            <option>Ukrainian</option>
          </select>

          <label htmlFor="des-lang-choice">Desired language(s)</label>
          <select className="des-lang-choice" value={desiredLanguage} onChange={handleDesiredLanguageChange}>
            <option>Ukrainian</option>
            <option>English</option>
          </select>
          <p className="error-message">{languageError}</p>

          <div className="link1">
            <button type="submit" className="confirm" onClick={handleSubmit}>
              Confirm
            </button>
              </div>
            </div>
          </div>
        </div>
        <Support/>
   </div>
  );
}

export default RegistrationPage;
