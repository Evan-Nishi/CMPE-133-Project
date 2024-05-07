import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUp from "./Pages/SignUpPage";
import Login from "./Pages/LoginPage";
import About from "./Pages/AboutPage";
import Home from "./Pages/HomePage";
import Profile from "./Pages/ProfilePage";


const App = () => {
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
