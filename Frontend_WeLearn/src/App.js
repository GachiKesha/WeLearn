import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import RegistrationPage from './components/pages/RegistrationPage';
import MenuPage from './components/pages/MenuPage';
import VideoCallPage from './components/pages/VideoCallPage';
import StartPage from './components/pages/StartPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/videocall" element={<VideoCallPage />} />
        <Route path="/start" element={<StartPage />} />
      </Routes>
    </Router>
  );
};

export default App;

