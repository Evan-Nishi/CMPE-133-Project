import React, { useState } from 'react';

const CreateEvent = () => {
    const [time, setTime] = useState('');
    const [invitees, setInvitees] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log("Time:", time);
        console.log("Invitees:", invitees);
        console.log("Description:", description);
    }

    return (
        <div className="box-border rounded-md md:box-content border-2 p-2 my-8 mx-auto max-w-md bg-lightBlue">
            <form onSubmit={handleSubmit}>
                <h1 className="text-bold text-4xl mb-4">Create event</h1>
                <div className="flex flex-col mb-4">
                    <div className="flex items-center mb-1">
                        <label htmlFor="time" className="w-1/3">Time:</label>
                        <input 
                            type="text" 
                            id="time" 
                            name="time" 
                            className="border border-gray-400 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 w-1/5" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        /> -
                        <input 
                            type="text" 
                            id="time" 
                            name="time" 
                            className="border border-gray-400 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 w-1/5" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center mb-1">
                        <label htmlFor="invitees" className="w-1/3">Invitees:</label>
                        <input 
                            type="text" 
                            id="invitees" 
                            name="invitees" 
                            className="border border-gray-400 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 w-1/2" 
                            value={invitees}
                            onChange={(e) => setInvitees(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center mb-1">
                        <label htmlFor="description" className="w-1/3">Description:</label>
                        <input 
                            type="text" 
                            id="description" 
                            name="description" 
                            className="border border-gray-400 rounded-md px-4 mt-1 focus:outline-none focus:border-blue-500 w-1/2 h-16" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="bg-medBlue hover:bg-medBlye text-white font-bold py-2 px-10 rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
