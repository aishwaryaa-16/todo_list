import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/login");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2ff] to-[#f0d9ff] p-8 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-blue-900">
        Verify Your Email
      </h2>
      <p className="text-center text-gray-700 mb-6">
        Enter the 6-digit code sent to your email address.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 flex flex-col items-center"
      >
        <div className="flex gap-3 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 bg-white bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          ))}
        </div>

        {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="max-w-36 font-bold py-3 px-4 rounded-lg bg-blue-900 text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" /> Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
