import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../hook/userHook/useAuthContext";
import useEventRes from '../hook/useEventRes';
const EventForm = ({ onClick, eventData }) => {
    const [isHidden, setIsHidden] = useState(false);

    console.log('event data:',eventData);

    useEffect(() => {
        if (eventData) {
            // Set the form fields based on the selected event data
            setTitle(eventData.title);
            setDescription(eventData.description);
            setDate(formatDate(eventData.date));
            setStartTime(translateTime(eventData.start));
            setEndTime(translateTime(eventData.end));
            setCreator(eventData.creator.creatorName);
            
            

          
        }
    }, [eventData]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [creator,setCreator] = useState(''); 
    const { user } = useAuthContext();
    const {response, respondToEvent} = useEventRes();

    const handleSubmit = async (status) => {
      try {
          if (status === 'accepted') {
              await respondToEvent(eventData._id, 'accepted');
          } else if (status === 'rejected') {
              await respondToEvent(eventData._id, 'rejected');
          }

          console.log('Response:', response);
          
          if (response.ok) {
              console.log('Successful');
          } else {
              console.log('Failed');
          }
      } catch (error) {
          console.error('Error responding to event invitation:', error);
      }
  };
  

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
  };

    const translateTime = (time) => {
      const hours = Math.floor(time / 4);
      const minutes = (time % 4) * 15; 
  
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      let formattedHours = hours % 12;
      formattedHours = formattedHours === 0 ? 12 : formattedHours;
  
      const formattedMinutes = minutes === 0 ? '00' : minutes;
  
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
    return (
      <div className={`box-border rounded-md md:box-content border-2 p-2 my-8 mx-auto max-w-md bg-lightBlue relative ${!isHidden ? '' : 'hidden'}`}>
        <button
            type="button"
            onClick={onClick}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
            X
        </button>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <h1 className="text-bold text-4xl mb-4">Invitation</h1>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Creator:</label>
                    <div className="bg-white rounded-md px-4 py-2">{creator}</div>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Title:</label>
                    <div className="bg-white rounded-md px-4 py-2">{title}</div>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Description:</label>
                    <div className="bg-white rounded-md px-4 py-2">{description}</div>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Date:</label>
                    <div className="bg-white rounded-md px-4 py-2">{date}</div>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Start Time:</label>
                    <div className="bg-white rounded-md px-4 py-2">{startTime}</div>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">End Time:</label>
                    <div className="bg-white rounded-md px-4 py-2">{endTime}</div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded mr-4"
                        onClick={() => handleSubmit('accepted')}
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-10 rounded"
                        onClick={() => handleSubmit('rejected')}
                    >
                        Reject
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
