import React, { useState } from "react";
import Button from "../Components/Button";
import Navbar from "../Components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Resets the form fields after successful submission
    setFormData({
      username: "",
      password: "",
    });
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="mb-4 font-bold text-3xl">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block font-bold text-xl">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="rounded-lg px-4 py-1 border"
              style={{ width: "500px" }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-bold text-xl">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-lg px-4 py-1 border"
              style={{ width: "500px" }}
            />
          </div>
          <div>
            <Button
              to="/home"
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded"
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
