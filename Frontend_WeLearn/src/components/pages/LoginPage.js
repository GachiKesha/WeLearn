import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './login.css';
import icon from './icon.png';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateFields = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const onSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) {
      // If form validation fails, don't proceed with the API call
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful!', data);
        // Handle successful login, store token or user data in your app
        // Add code for handling successful login
      } else {
        const errorData = await response.json();
        console.error('Login failed. Please check your credentials.', errorData);
        // Handle error, display error message to the user
        // Add code for handling login errors
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other errors
      // Add code for handling other errors
    }
  };
  
  return (

    <div>
      <Header />
      <div className="container1 flex">
        <img src={icon} alt="Icon" />
        <div className="page flex">
          <div className="post1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="mail@abc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="*****************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <label className="checkbox-container">
              Remember Me
              <input type="checkbox" id="remember" name="remember" />
              <div className="checkmark"></div>
              <a href="##" className="forgot-link">
                Forgot Password?
              </a>
            </label>
            <div className="link">
              <button type="button" onClick={onSubmit} className="login">
                Login
              </button>
              <p>
                Not Registered Yet?{' '}
                <Link to="/registration" className="createAcc">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Support />
    </div>
  );
}

export default LoginPage;
