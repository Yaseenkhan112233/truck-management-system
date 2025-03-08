// ForgotPassword.js
import React, { useState } from "react";
import { sendPasswordResetEmailToUser } from "../firabse/Fireabase"; // Adjust path as needed
import { Link } from "react-router-dom"; // Assuming you're using React Router

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus({
        type: "error",
        message: "Please enter your email address",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await sendPasswordResetEmailToUser(email);
      setStatus({
        type: "success",
        message: "Password reset link sent! Check your email inbox.",
      });
      setEmail("");
    } catch (error) {
      let errorMessage = "Failed to send password reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please provide a valid email address";
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/Images/jls.svg" alt="Logo" className="w-32 h-12" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Reset Your Password
          </h2>

          <p className="text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {/* Status Message */}
          {status.message && (
            <div
              className={`text-center p-2 rounded ${
                status.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
