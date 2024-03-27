// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import SignUp from "./Pages/SignUpPage";
import Login from "./Pages/LoginPage";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes for other pages */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
