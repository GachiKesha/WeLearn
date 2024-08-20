import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import AnimatedFooter from "../common/AnimatedFooter";
import Support from "../common/Support";
import "./style.css";
import "./registr.css";
import icon from "./icon.png";

function RegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mainLanguage, setMainLanguage] = useState("English");
  const [desiredLanguage, setDesiredLanguage] = useState("Ukrainian");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [languageError, setLanguageError] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!repeatPassword) {
      setRepeatPasswordError("Please repeat your password.");
      isValid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setRepeatPasswordError("");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (mainLanguage === desiredLanguage) {
      setLanguageError("Please choose different desired language.");
      isValid = false;
    } else {
      setLanguageError("");
    }

    return isValid;
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim() !== "") {
      setNameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim() !== "") {
      setPasswordError("");
    }
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    if (e.target.value.trim() !== "") {
      setRepeatPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value.trim();
    setEmail(inputValue);

    if (inputValue !== "") {
      setEmailError("");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputValue)) {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleMainLanguageChange = (e) => {
    setMainLanguage(e.target.value);
    if (e.target.value.trim() !== "") {
      setLanguageError("");
    }
  };

  const handleDesiredLanguageChange = (e) => {
    setDesiredLanguage(e.target.value);
    if (e.target.value.trim() !== "") {
      setLanguageError("");
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(`${backendUrl}/signup/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            password: password,
            email: email,
            languages: {
              known_language: mainLanguage,
              desired_language: desiredLanguage,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Registration successful!");
          sessionStorage.setItem("isAuthenticated", true);

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

          navigate("/menu");
        } else {
          const errorData = await response.json();
          console.error(
            "Registration failed. Please check the form for errors.",
            errorData
          );
        }
      } catch (error) {
        console.error(
          "An error occurred while processing the registration.",
          error
        );
      }
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
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <p className="error-message">{nameError}</p>

            <label htmlFor="password">Password</label>
            <input
              type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
              placeholder="*****************"
              value={password}
              onChange={handlePasswordChange}
            />
            <p className="error-message">{passwordError}</p>

            <label htmlFor="repeat-password">Repeat password</label>
            <input
              type="password"
              placeholder="*****************"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
            />
            <p className="error-message">{repeatPasswordError}</p>

            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="mail@abc.com"
              value={email}
              onChange={handleEmailChange}
            />
            <p className="error-message">{emailError}</p>

            <label htmlFor="lang-choice">Main language(s)</label>
            <select
              className="lang-choice"
              value={mainLanguage}
              onChange={handleMainLanguageChange}
            >
              <option>English</option>
              <option>Ukrainian</option>
              <option>Spain</option>
              <option>German</option>
              <option>Italian</option>
            </select>

            <label htmlFor="des-lang-choice">Desired language(s)</label>
            <select
              className="des-lang-choice"
              value={desiredLanguage}
              onChange={handleDesiredLanguageChange}
            >
              <option>Ukrainian</option>
              <option>English</option>
              <option>Spain</option>
              <option>German</option>
              <option>Italian</option>
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
      <Support />
      <AnimatedFooter />
    </div>
  );
}

export default RegistrationPage;
