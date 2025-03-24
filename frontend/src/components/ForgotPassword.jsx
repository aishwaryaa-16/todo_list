import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);  //user is prompted to enter email, when they submit, forgotPassword action is called and email is passed as the parameter
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-300 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Forgot Password?
        </h2>
        {!isSubmitted ? (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-center text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-bold rounded-lg shadow-lg transition duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="h-8 w-8" />
              </motion.div>
              <p className="text-gray-700">
                If an account exists for <strong>{email}</strong>, you will
                receive a password reset link shortly.
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
