import { useState, useCallback } from "react";

const useGetEvents = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (eventIds) => {
    setLoading(true);
    setError(null);
    setEventsData([]);

    try {
      const events = await Promise.all(
        eventIds.map(async (eventId) => {
          const response = await fetch(`/events/${eventId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch event with ID: ${eventId}`);
          }
          return response.json();
        })
      );
      setEventsData(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { eventsData, loading, error, fetchEvents };
};

export default useGetEvents;