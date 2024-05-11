import { useState } from "react";

const useEventRes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const respondToEvent = async (eventId, status) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch(`/event/respond`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ eventId, status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to respond to event invitation"
        );
      }
      setResponse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, response, respondToEvent };
};

export default useEventRes;
