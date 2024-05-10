import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hook/useAuthContext";
import { FaUserCircle, FaPaperclip } from "react-icons/fa";
import Calendar from "../Components/Calendar";
import CreateEvent from "../Components/CreateEvent";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [friendState, setFriendState] = useState(null);
  const [isFriendOrPending, setIsFriendOrPending] = useState(false);
  const { username } = useParams();
  const { user } = useAuthContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/profile/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const handleAddFriend = async () => {
    if (!user) {
      return;
    }
    try {
      const friendId = userData.id;
      const response = await fetch("/friends", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to add friend: ${message}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        await response.json();
      }

      await fetchUserProfile();
    } catch (error) {
      console.error("Failed to add friend:", error);
      alert(error.message); // Fixed typo here from `messxage` to `message`
    }
  };

  const handleInvitationResponse = async (response) => {
    if (!userData || !user) {
      console.log("Invalid operation. No user or userData available.");
      return;
    }
    const friendId = userData.id;

    try {
      const result = await fetch("/friends", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          friendId: friendId,
          status: response,
        }),
      });

      if (!result.ok) {
        const contentType = result.headers.get("Content-Type");
        const errorText = await (contentType &&
        contentType.includes("application/json")
          ? result.json()
          : result.text());
        throw new Error(
          `Failed to process the invitation response: ${errorText}`
        );
      }

      await fetchUserProfile();
    } catch (error) {
      console.error("Error processing invitation response:", error);
      console.log("Error processing your response. Please try again.");
    }
  };

  const updateFriendState = () => {
    if (userData && user) {
      const friendInfo = userData.friends?.find((f) => f.friend === user.id);
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
          <div className="pb-10 font-bold text-black bg-lightBlue justify-start flex relative flex-row items-start px-10 w-full h-52 overflow-visible">
            <FaUserCircle className="object-cover min-h-48 w-96 -mt-16" />
            <div className="flex relative flex-col max-w-full w-[120px] max-md:ml-0 md:pt-16">
              <div className="flex items-center">
                <div className="self-start text-2xl max-md:ml-2.5">
                  {userData.username}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold p-0.5 border border-gray-400 rounded shadow"
                  title="Copy Profile URL"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaPaperclip />
                </button>
              </div>
              {username !== user.username &&
                (!isFriendOrPending ? (
                  <button
                    className="justify-center p-2 mt-9 text-base bg-gray-200"
                    onClick={handleAddFriend}
                  >
                    + Add Friend
                  </button>
                ) : friendState === "pending" ? (
                  <div className="justify-center p-2 mt-9 text-base bg-gray-200">
                    Friend Request Sent
                  </div>
                ) : friendState === "invited" ? (
                  <div className="relative">
                    <div
                      className="cursor-pointer justify-center p-2 mt-9 text-base bg-gray-200 md:w-48"
                      onClick={() =>
                        setIsDropdownVisible((prevState) => !prevState)
                      }
                    >
                      Invitation Received ↓
                    </div>
                    {isDropdownVisible && (
                      <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                          onClick={() => handleInvitationResponse("accepted")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Accept ✅
                        </button>
                        <button
                          onClick={() => handleInvitationResponse("rejected")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Reject ❌
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="justify-center p-2 mt-9 text-base bg-gray-200">
                    Friends 🤝
                  </div>
                ))}
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex-1">
              <Calendar schedule={userData.schedule} />
            </div>
            <div className="flex-1" style={{ maxHeight: "600px" }}>
              <CreateEvent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
