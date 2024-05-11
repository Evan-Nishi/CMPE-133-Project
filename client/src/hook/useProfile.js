import { useState, useEffect } from "react";

const useProfile = (username) => {
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async (username) => {
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

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  return { userData, fetchUserProfile };
};

export default useProfile;
