// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useLogout } from "../hook/userHook/useLogout";
import { useAuthContext } from "../hook//userHook/useAuthContext";
import { FaUser, FaEnvelope, FaUserGroup } from "react-icons/fa6";
import { useState, useEffect } from "react";
import useGetEvent from "../hook/useGetEvent";
import EventForm from "./EventForm";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [eventInvitationVisible, setEventInvitationVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { eventsData, fetchEvents } = useGetEvent();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData(user.username);
    }
  }, [user?.username]);

  useEffect(() => {
    if (userData) {
      const pendingEvents = userData.events.filter(
        (event) => event.status === "pending"
      );
      fetchEvents(pendingEvents.map((event) => event.eventId));
      setPendingEvents(pendingEvents);
    }
  }, [userData]);

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(`/profile/${username}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user data:", err.message);
    }
  };

  const handleLogout = () => {
    setIsDropdownVisible(false);
    setInvitationVisible(false);
    logout();
  };

  return (
    <nav className="bg-blue-300 flex flex-row justify-between items-center md:py-4 w-full">
      <Link to="/">
        <div className="text-left font-bold text-4xl">Fren2Meet</div>
      </Link>
      {user && (
        <div className="flex flex-row items-center justify-end w-full">
          <div className="relative w-1/3 flex justify-end md:mr-12">
            <div
              onClick={() => {
                setIsDropdownVisible(false);
                setInvitationVisible(false);
                setEventInvitationVisible((prevState) => !prevState);
              }}
              className="mr-4 cursor-pointer"
            >
              <FaEnvelope />
            </div>
            <div
              onClick={() => {
                setIsDropdownVisible(false);
                setEventInvitationVisible(false);
                setInvitationVisible((prevState) => !prevState);
              }}
              className="mr-4 cursor-pointer"
            >
              <FaUserGroup />
            </div>
            <div
              onClick={() => {
                setInvitationVisible(false);
                setEventInvitationVisible(false);
                setIsDropdownVisible((prevState) => !prevState);
              }}
              className="cursor-pointer"
            >
              <FaUser />
            </div>
            {isDropdownVisible && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <a
                    href={`/profile/${user.username}`}
                    onClick={() => setIsDropdownVisible(false)}
                  >
                    <li className="block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold">
                      User: {user.username}
                    </li>
                  </a>
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
                  {userData.friends.filter(
                    (friend) => friend.status === "pending"
                  ).length > 0 && (
                    <li className="block px-4 py-2 text-sm text-black text-center ">
                      Your Friend Requests
                    </li>
                  )}
                  {userData.friends.filter(
                    (friend) => friend.status === "pending"
                  ).length === 0 ? (
                    <li className="block px-4 py-2 text-sm text-black text-center font-bold">
                      No friends request
                    </li>
                  ) : (
                    userData.friends
                      .filter((friend) => friend.status === "pending")
                      .map((friend, index) => (
                        <a
                          href={`/profile/${friend.name}`}
                          onClick={() => setInvitationVisible(false)}
                          key={index}
                        >
                          <li className="block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold">
                            {friend.name}{" "}
                          </li>
                        </a>
                      ))
                  )}
                </ul>
              </div>
            )}
            {eventInvitationVisible && userData && userData.events && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1">
                  {userData.events.filter((event) => event.status === "pending")
                    .length > 0 && (
                    <li className="block px-4 py-2 text-sm text-black text-center ">
                      Your Event Invitations
                    </li>
                  )}
                  {pendingEvents.length === 0 ? (
                    <li className="block px-4 py-2 text-sm text-black text-center font-bold">
                      No event invitations
                    </li>
                  ) : (
                    eventsData.map((event, index) => (
                      <li
                        key={index}
                        className="block px-4 py-2 text-sm text-black text-center hover:bg-lightBlue font-bold"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEventFormVisible(true);
                        }}
                      >
                        {event.title}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          {isEventFormVisible && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
              <EventForm
                onClick={() => setIsEventFormVisible(!isEventFormVisible)}
                eventData={selectedEvent}
              />
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="ml-auto flex flex-row justify-between items-center">
          <Button
            to="/login"
            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded mr-4"
          >
            Log In
          </Button>
          <Button
            to="/signup"
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-6 rounded mr-4"
          >
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
