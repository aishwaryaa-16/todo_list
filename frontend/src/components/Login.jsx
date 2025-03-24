import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore(); // Import login action from useAuthstore
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);  //form data is passed to login action
    navigate('/tasks');
    console.log('Logging In...', formData);  //whatever user enters is stored in form data, when login function is called, form data is passed to it
  };

  return (  
    <div className="container mx-auto my-5 p-5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 min-h-[65vh] w-full md:w-3/4 lg:w-1/2 flex flex-col items-center">
      {isLoggingIn ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-blue-950 text-center mb-5 py-5">Welcome Back</h1>
          
          <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>
            <Link to={"/forgot-password"} className="text-blue-700 hover:underline text-sm">
              Forgot Password?
            </Link>
            
            <button 
              type="submit" 
              className="w-full bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 rounded-md mt-4">
              Log In
            </button>
          </form>
          
          <p className="text-gray-700 mt-4">
            Don't have an account? 
            <Link to="/signup" className="text-blue-700 font-bold ml-2 hover:underline">Sign Up</Link>
          </p>
        </>
      )}
    </div>
  );
};

export { Login };