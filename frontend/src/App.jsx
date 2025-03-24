import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import { Login } from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/tasks"
            element={authUser ? <Tasks /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              !authUser ? (
                <Login />
              ) : !authUser ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/tasks" />
              )
            }
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
