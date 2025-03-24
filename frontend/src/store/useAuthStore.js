import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isLoading: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");  //fetch the api specified in the backend USING AXIOUS and simultaneously display the result in the front end
      set({ authUser: res.data });        //RESULT-CREATE USER, LOGIN, LOGOUT, VERIFY EMAIL, FORGOT PASSWORD, RESET PASSWORD
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("A verification code has been sent to your email");
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/auth/verify-email`, { code });
      set({
        authUser: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
        authUser: null,
      });
      throw error;
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData); //
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error(error.response.data.message);
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axiosInstance.post("auth/forgot-password", {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `auth/reset-password/${token}`,
        {
          password,
        }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting the password",
      });
      throw error;
    }
  },
}));