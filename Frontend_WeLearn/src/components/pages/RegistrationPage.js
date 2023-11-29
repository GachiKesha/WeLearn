import React from 'react';
import Header from '../common/Header'; 
import Support from '../common/Support';
import './style.css'; 
import './registr.css'; 
import icon from './icon.png'; 

function RegistrationPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>WeLearn Registration Page</title>
      </head>
      <body>
        <Header /> 
        <div className="container flex">
          <img src={icon} alt="Icon" />
          <div className="page flex">
            <div className="post">
              <label htmlFor="Name">Name</label>
              <input type="Name" placeholder="Name" required />
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="*****************" required />
              <label htmlFor="repeat-password">Repeat password</label>
              <input type="password" placeholder="*****************" required />
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="mail@abc.com" required />
              <label htmlFor="lang-choice">Main language(s)</label>
              <select className="lang-choice">
                <option>English</option>
                <option>Ukrainian</option>
              </select>
              <label htmlFor="des-lang-choice">Desired language(s)</label>
              <select className="des-lang-choice">
                <option>Ukrainian</option>
                <option>English</option>
              </select>
              <div className="link">
                <button type="submit" className="confirm">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
        <Support/>
      </body>
    </html>
  );
}

export default RegistrationPage;
