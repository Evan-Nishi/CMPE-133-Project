// About.js
import React from 'react';

const About = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-lightBlue p-6 rounded-md shadow-md text-center">
        <h1 className="text-3xl font-bold text-medBlue mb-2">About Us</h1>
        <p className="text-darkBlue">
          Welcome to our About page. This is a schedule planner app
        </p>
      </div>
    </div>
  );
};

export default About;
