import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


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
      } 

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

  
  const handleInvitationResponse = async (response) => {
    if (!userData || !user) {
        console.log("Invalid operation. No user or userData available."); 
        return;
    }
    const friendId = userData.id; 

    try {
        const result = await fetch('/friends', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                friendId: friendId,
                status: response
            })
        });

        const contentType = result.headers.get('Content-Type');
        if (!result.ok) {
            const errorText = await (contentType.includes('application/json') ? result.json() : result.text());
            throw new Error(`Failed to process the invitation response: ${errorText}`);
        }

        if (contentType.includes('application/json')) {
            const data = await result.json();
            console.log(data.message || `Friend request ${response}ed.`);
        } else {
            const textData = await result.text();
            console.log("Received non-JSON response:", textData);
        }

        await fetchUserProfile();
        window.location.reload(); //remove if nessesary
    } catch (error) {
        console.error('Error processing invitation response:', error);
        console.log('Error processing your response. Please try again.');
    }
};


const updateFriendState = () => {
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
};
useEffect(() => {
  updateFriendState();
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
                <div className="relative">  {/* This wrapper div to control position */}
                  <div className="cursor-pointer justify-center p-2 mt-9 text-base bg-gray-200 md:w-48" onClick={() => setIsDropdownVisible(prevState => !prevState)}>
                    Invitation Received ↓
                  </div>
                  {isDropdownVisible && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-10">
                      <button onClick={() => handleInvitationResponse('accepted')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Accept ✅</button>
                      <button onClick={() => handleInvitationResponse('rejected')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reject ❌</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="justify-center p-2 mt-9 text-base bg-gray-200">Friends 🤝</div>
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
