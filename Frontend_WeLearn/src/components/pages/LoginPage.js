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
<<<<<<< HEAD
    <div>
        
        <div className="container1 flex">
=======
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>WeLearn Login Page</title>
      </head>
      <body>
        <Header />
        <div className="container flex">
>>>>>>> parent of c6650d5b (Update LoginPage.js)
          <img src={icon} alt="Icon" />
          <div className="page flex">
            <div className="post">
              <form onSubmit={onSubmit}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="mail@abc.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="*****************"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <label className="checkbox-container">
                  Remember Me
                  <input type="checkbox" id="remember" name="remember" />
                  <div className="checkmark"></div>
                  <a href="##" className="forgot-link">
                    Forgot Password?
                  </a>
                </label>
                <div className="link">
                  <button type="submit" className="login">
                    Login
                  </button>
                  <p>
                    Not Registered Yet?{' '}
                    <Link to="/registration" className="createAcc">
                      Create account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Support />
    
  </div>
  );
}

export default LoginPage;
