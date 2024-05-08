import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext} from '../hook/useAuthContext';
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [friendState, setFriendState] = useState(null);
  const [isFriendOrPending, setIsFriendOrPending] = useState(false);
  const { username } = useParams();
  const {user} = useAuthContext();
  const navigate = useNavigate();

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

  const handleAddFriend = async () => {
    if(!user){
      return;
    }
    try {
      const friendId = userData.id; 
      const response = await fetch('/friends', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        // Attempt to read the response as text regardless of type
        const message = await response.text();
        throw new Error(`Failed to add friend: ${message}`);
      }

      const contentType = response.headers.get('Content-Type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      // if (typeof result === 'string') {
      //   alert(result); // Handle plain text responses
      // } else {
      //   alert(`Friend request sent: ${result.message}`); // Handle JSON responses
      // }

      setUserData({
        ...userData,
        friends: [...userData.friends, { friend: friendId, status: 'pending' }]
      });

      await fetchUserProfile();

    } catch (error) {
      console.error('Failed to add friend:', error);
      alert(error.messxage); // Show the error message
    }
}

  useEffect(() => {
    if (userData && user) {
      const friendInfo = userData.friends?.find(f => f.friend === user.id);
      if (friendInfo) {
        setFriendState(friendInfo.status);
        setIsFriendOrPending(true);
      } else {
        setFriendState(null);
        setIsFriendOrPending(false);
      }
    }
    console.log('friend state', friendState);
  }, [userData, user]);

  useEffect(() => {
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


  
  
// console.log('isFriendOrPending:', isFriendOrPending);
// const firstFriend = userData.friends?.length > 0 ? userData.friends[0] : 'No friends';
// console.log('first friend of nguyenphuc:', firstFriend);
// console.log('phucnguyenid:', user.id); 

  return (
    <div>
    {user && (
      <div className="flex flex-col pt-20 font-bold text-black overflow-visible">
        <div className=" pb-10 font-bold text-black bg-lightBlue justify-start flex relative flex-row items-start px-10 w-full h-52 overflow-visible">
          <FaUserCircle className=' object-cover min-h-48 w-96 -mt-16'/>  
          <div className="flex relative flex-col max-w-full w-[120px] max-md:ml-0 md:pt-16">
            <div className="self-start text-2xl max-md:ml-2.5">{userData.username}</div>
            {username !== user.username && (
              !isFriendOrPending ? (
                <button className="justify-center p-2 mt-9 text-base bg-gray-200" onClick={handleAddFriend}>
                  + Add Friend
                </button>
              ) : friendState === 'pending' ? (
                <div className="justify-center p-2 mt-9 text-base bg-gray-200">Friend Request Sent</div>
              ) : friendState === 'invited' ? (
                <div className="justify-center p-2 mt-9 text-base bg-gray-200">Invitation Received</div>
              ) : (
                <div className="justify-center p-2 mt-9 text-base bg-gray-200">Friends</div>
              )
            )}
              
          </div>
        </div> 
      </div>
    )}
    </div>
  )
};

export default UserProfile;
