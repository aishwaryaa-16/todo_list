import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // Import toast for error messages

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { signup, isSigningUp } = useAuthStore();  //signup action is imported from useAuthStore and isSigningUp is used to check if user is signing up
  const [formData, setFormData] = useState({
    fullName: "",  //all the 3 fields is initially empty
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.fullName) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const success = validateForm();
      if (success) {
        console.log("Form data:", formData);
        signup(formData); //signup action is called with form data as parameter-manages the signup process in frontend and backend
        navigate("/verify");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto my-5 p-5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 px-4 min-h-[90vh] w-full md:w-3/4 lg:w-1/2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-950 text-center mb-5 py-5">
          Create an Account
        </h1>

        <form
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Link
              to={"/forgot-password"}
              className="text-blue-700 hover:underline text-sm"
            >
              Forgot Password?
            </Link>
            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={formData.password} />
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 rounded-md mt-4 flex justify-center items-center gap-2"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Signing Up...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-gray-700 mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-700 font-bold ml-2">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;