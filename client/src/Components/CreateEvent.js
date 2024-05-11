import React, { useState, useContext } from "react";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const timeToIntervals = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 4 + Math.floor(minutes / 15);
  };

  const getLocalDate = (localDate) => {
    return new Date(localDate + "T00:00:00");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const participantsArray = participants.split(",").map((username) => ({
      username: username.trim(),
      status: "pending",
    }));

    const eventData = {
      title,
      description,
      participants: participantsArray,
      date: getLocalDate(date).toISOString(),
      start: timeToIntervals(startTime),
      end: timeToIntervals(endTime),
    };

    try {
      const response = await fetch("/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Error creating event");
        } else {
          const errorText = await response.text();
          throw new Error(errorText);
        }
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(error.message);
    }
    window.location.reload();
  };

  return (
    <div className="box-border rounded-md md:box-content border-2 p-2 my-8 mx-auto max-w-md bg-lightBlue">
      <form onSubmit={handleSubmit}>
        <h1 className="text-bold text-4xl mb-4">Create Event</h1>
        <div className="flex flex-col mb-4">
          <label className="mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            required
          />

          <label className="mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full h-32"
            required
          />

          <label className="mb-2">Participants (comma-separated):</label>
          <input
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
          />

          <label className="mb-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            required
          />

          <label className="mb-2">Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            required
          />

          <label className="mb-2">End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-medBlue hover:bg-medBlue text-white font-bold py-2 px-10 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
