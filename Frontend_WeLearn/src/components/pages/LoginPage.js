import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import AnimatedFooter from "../common/AnimatedFooter";
import Support from "../common/Support";
import "./style.css";
import "./login.css";
import icon from "./icon.png";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const onSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("isAuthenticated", true);
        console.log("Login successful!");

        sessionStorage.setItem("token", data.token);
        const token = sessionStorage.getItem("token");
        if (token) {
          console.log("Token:", token);
        } else {
          console.log("Token not found");
        }

        sessionStorage.setItem("username", data.user.username);
        sessionStorage.setItem(
          "knownLanguage",
          data.user.languages.known_language
        );
        sessionStorage.setItem(
          "desiredLanguage",
          data.user.languages.desired_language
        );
        const username = sessionStorage.getItem("username");
        const knownLanguage = sessionStorage.getItem("knownLanguage");
        const desiredLanguage = sessionStorage.getItem("desiredLanguage");
        console.log("Username:", username);
        console.log("Known Language:", knownLanguage);
        console.log("Desired Language:", desiredLanguage);

        console.log("Navigating to /menu");
        navigate("/menu");
      } else {
        const errorData = await response.json();
        console.error("Login failed.", errorData);
        alert("Login failed. Please check your login information.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
              <input type="checkbox" id="remember" name="remember" />
              <div className="checkmark"></div>
              <p>Remember Me</p>
              <a href="##" className="forgot-link">
                Forgot Password?
              </a>
            </label>
            <div className="link">
              <button type="button" onClick={onSubmit} className="login">
                Login
              </button>
              <p>
                Not Registered Yet?{" "}
                <Link to="/registration" className="createAcc">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Support />
      <AnimatedFooter />
    </div>
  );
}

export default LoginPage;
