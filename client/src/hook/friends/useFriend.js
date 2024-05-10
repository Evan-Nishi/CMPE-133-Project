// useFriend.js
import { useState } from "react";

const useFriend = () => {
  const [error, setError] = useState(null);

  const addFriend = async (friendId) => {
    try {
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
    } catch (error) {
      console.error("Failed to add friend:", error);
      setError(error.message);
    }
  };

  const invitationResponse = async (friendId, response) => {
    try {
      const result = await fetch("/friends", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          friendId,
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
    } catch (error) {
      console.error("Error processing invitation response:", error);
      setError(error.message);
    }
  };

  return { error, addFriend, invitationResponse };
};

export default useFriend;
