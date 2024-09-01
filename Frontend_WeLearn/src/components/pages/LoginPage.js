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
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateFields();
    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });      

      if (response.ok) {
        const data = await response.json();
        const {
          user: {
            username,
            languages: { known_language, desired_language },
          },
        } = data;
        sessionStorage.setItem("isAuthenticated", true);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("knownLanguage", known_language);
        sessionStorage.setItem("desiredLanguage", desired_language);        

        navigate("/menu");

      } else {
        const errorData = await response.json();
        console.error("Login failed.", errorData);
        alert("Login failed. Please check your login information.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
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
                {loading ? "loading...": "Login"}
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
