// Navbar.js
import React from "react";
import { Link} from "react-router-dom";
import Button from "./Button";
import { useLogout } from "../hook/useLogout";
import { useAuthContext } from "../hook/useAuthContext";
import { FaUser } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { RiMailSendFill } from "react-icons/ri";





const Navbar = () => {
  const {logout} = useLogout();
  const{user} = useAuthContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    if (user) {
      fetchUserData(user.username); // Fetch user data if logged in
    }
  }, [user?.username]);

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(`/profile/${username}`, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data); // Set fetched data into state
    } catch (err) {
      console.error('Error fetching user data:', err.message);
      // Optionally handle the error (e.g., show a notification)
    }
  };


  const handleLogout= () => {
    setIsDropdownVisible(false)
    logout()
  }

  console.log('current user:', userData);
  return (
    <nav className="bg-blue-300 flex flex-row justify-between items-center md:py-4 w-full">
      <Link to="/">
        <div className="text-left font-bold text-4xl">Fren2Meet</div>  
      </Link>
      {user && (
        <div className="flex flex-row items-center justify-end w-full">   {/*change justify when add search bar*/}
          {/* <div className="relative md:ml-12 md:w-3/4">
            <form className=" flex justify-center ">  
              <input
                type="text"
                id="friendSearch"
                name="friendSearch"
                placeholder= "Search"
                className="rounded-lg px-4 py-1 border md:w-full"
              />
            </form>
            <div className="absolute md:w-full mt-2 bg-white rounded-md shadow-lg">
                <ul className="py-1">
                  <li >
                    ryan
                  </li>
                  <li>
                    Johnny
                  </li>
                </ul>
            </div>
          </div> */}
          <div className="relative w-1/3 flex justify-end md:mr-12">  
            <div onClick={() => setIsDropdownVisible((prevState) => !prevState)}  className="mr-4 cursor-pointer">
              <FaUser/>
            </div>
            <div onClick={() => setInvitationVisible((prevState) => !prevState)} className="cursor-pointer">
              <RiMailSendFill />
            </div>
            {isDropdownVisible && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <Link to={`/profile/${user.username}`} onClick={() => setIsDropdownVisible(false)}>
                    <li className="block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold">
                      {user.username}
                    </li>
                  </Link>
                  <li>
                    <Button
                      type="button"
                      className="block px-4 py-2 text-sm hover:bg-lightBlue w-full"
                      onClick={handleLogout}
                    >
                      <div className="font-bold text-black">LOGOUT</div>
                    </Button>
                  </li>
                </ul>
              </div>
            )}
            {invitationVisible && userData && userData.friends && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1">
                  {userData.friends.filter(f => f.status === 'invited').map((friend, index) => (
                    <li key={index} className="block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold">
                      {friend.friend} {/* Display friend ID for now as no name is available */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!user && (
        <div className="ml-auto flex flex-row justify-between items-center">  
          <Button
            to="/login"
            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
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
