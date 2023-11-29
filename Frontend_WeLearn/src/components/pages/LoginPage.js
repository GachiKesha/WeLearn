import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './login.css';
import icon from './icon.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Handle error, display error message to the user
        console.error('Login failed');
        return;
      }

      const data = await response.json();
      // Handle successful login, store token or user data in your app

      console.log('Login successful', data);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>WeLearn Login Page</title>
      </head>
      <body>
        <Header />
        <div className="container flex">
          <img src={icon} alt="Icon" />
          <div className="page flex">
            <div className="post">
            <label htmlFor="email">Email</label>
              <input type="email" placeholder="mail@abc.com" required />
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="*****************" required />
              <label className="checkbox-container">
                Remember Me
                <input type="checkbox" id="remember" name="remember" />
                <div className="checkmark"></div>
                <a href="##" className="forgot-link">
                  Forgot Password?
                </a>
              </label>
              <div className="link">
                <button type="submit" onClick={onSubmit} className="login">
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
      </body>
    </html>
  );
}

export default LoginPage;