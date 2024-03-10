// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className= "flex justify-between bg-medBlue p-2">
      <h1 className= 'w-full text-3xl font-bold text-darkBlue'> FrentoMeet</h1>
      <ul className="flex">
        <li className='p-2'><Link to="/" className="text-white hover:bg-lightBlue">Home</Link></li>
        <li className ='p-2'><Link to="/about" className="text-white hover:bg-lightBlue">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
