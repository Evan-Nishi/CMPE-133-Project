// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useLogout } from "../hook/useLogout";
import { useAuthContext } from "../hook/useAuthContext";
import { FaUser } from "react-icons/fa6";
import { useState } from "react";

const Navbar = () => {
  const {logout} = useLogout()
  const{user} = useAuthContext()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLogout= () => {
    setIsDropdownVisible(false)
    logout()
  }

  return (
    <nav className="bg-blue-300 px-10 py-4 flex justify-center items-center">
      <Link to = '/'>
      <div className="text-left font-bold text-4xl flex-grow">Fren2Meet</div>
      </Link>
      { user && ( 
        <div className="ml-auto flex items-center">
          <div className="relative">
              <div onClick={() => setIsDropdownVisible(prevState => !prevState)}>
                  <FaUser/>
              </div>
              { isDropdownVisible && (
                  <div className="absolute down-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <ul className="py-1">
                          <li className= "block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold">{user.username}</li>
                          <li>
                              <Button type="button" className="block px-4 py-2 text-sm hover:bg-lightBlue w-full " onClick={handleLogout}>
                                <div className= "font-bold text-black">
                                  LOGOUT
                                </div>
                              </Button>
                          </li>
                      </ul>
                  </div>
              )}
          </div>
    </div>

      )}
      {!user && (
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
      )}
    </nav>
  );
};

export default Navbar;
