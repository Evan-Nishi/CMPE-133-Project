// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  return (
    <nav className="bg-blue-300 px-10 py-14 flex justify-center items-center">
      <div className="text-center font-bold text-4xl flex-grow">Fren2Meet</div>
      <div className="ml-auto flex items-center">
        <Button
          to="/login"
          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded mr-12"
        >
          Log In
        </Button>
        <Button
          to="/signup"
          className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
