// SignUp.js
import React, { useState, useEffect} from 'react';
import Button from '../Components/Button';
import { useSignup } from '../hook/useSignup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmpassword: ''
    });

    const { signup, error } = useSignup();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.username || !formData.password || !formData.confirmpassword) {
          toast.error('Please fill in all fields');
          return;
      }
      if (formData.password !== formData.confirmpassword) {
          toast.error('Passwords do not match');
          return;
      }
  
      await signup(formData.username, formData.password);
  };

  useEffect(() => {
    if(error){
      toast.error(error)
    }
  },[error])

    return (
        <>
         
            <div className="p-8">
                <h2 className="mb-4 font-bold text-3xl">Sign Up</h2>
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
                            style={{ width: '500px' }}
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
                            style={{ width: '500px' }}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirmpassword"
                            className="block font-bold text-xl"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmpassword"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            className="rounded-lg px-4 py-1 border"
                            style={{ width: '500px' }}
                        />
                    </div>
                    <div>
                        <Button
          
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded"
                        >
                            Sign Up
                        </Button>
                    </div>
                </form>
            </div>
            <ToastContainer autoClose={3000} position="top-right" />
        </>
    );
};

export default SignUp;
