import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import { useLogin} from "../hook/useLogin"
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const {login, error} = useLogin()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
        toast.error('Please fill in all fields');
        return;
    }

    await login(formData.username, formData.password, formData.rememberMe);
  
  };

  useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);


  return (
    <>
  
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
          <div className="mb-6">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="font-bold">
              Remember Me
            </label>
          </div>
          <div>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded"
            >
              Log In
            </Button>
          </div>
        </form>
      <ToastContainer autoClose={3000} position="top-right" />
      </div>
      
    </>
  );
};

export default Login;
