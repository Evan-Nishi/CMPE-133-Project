import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext} from '../hook/useAuthContext';
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const {user} = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/profile/${username}`);
        if (!response.ok) {  
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, [username]);

  if(!user) {
    navigate('/login')
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    {user && (
      <div className="flex flex-col pt-20 font-bold text-black overflow-visible">
        <div className=" pb-10 font-bold text-black bg-lightBlue justify-start flex relative flex-row items-start px-10 w-full h-52 overflow-visible">
          <FaUserCircle className=' object-cover min-h-48 w-96 -mt-16'/>  
          <div className="flex relative flex-col max-w-full w-[120px] max-md:ml-0 md:pt-16">
            <div className="self-start text-2xl max-md:ml-2.5">{userData.username}</div>
            { username !== user.username && (<button className="justify-center p-2 mt-9 text-base bg-gray-200">
                + Add Friend
            </button> )}
          </div>
        </div> 
      </div>
    )}
    </div>
  )
};

export default UserProfile;
