// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-medBlue p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-white hover:bg-lightBlue">Home</Link></li>
        <li><Link to="/about" className="text-white hover:bg-lightBlue">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
