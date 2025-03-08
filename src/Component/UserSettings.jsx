import React, { useState } from "react";
import {
  getAuth,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const UserSettings = ({ user }) => {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth();

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!newEmail || !currentPassword) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      // First, reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Use verifyBeforeUpdateEmail instead of updateEmail
      // This sends a verification email to the new address first
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

      setStatus({
        type: "success",
        message: `Verification email sent to ${newEmail}. Please check your inbox and follow the verification link to complete the email change.`,
      });

      // Clear the form
      setNewEmail("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Email update error:", error.code, error.message);
      let errorMessage = "Failed to update email";

      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use";
          break;
        case "auth/requires-recent-login":
          errorMessage =
            "This operation requires recent authentication. Please log in again before retrying";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email verification is required. Please contact support if you're having issues.";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
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
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Account Settings
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Email Address
        </h3>

        {status.message && (
          <div
            className={`p-3 mb-4 rounded ${
              status.type === "error"
                ? "bg-red-100 text-red-700"
                : status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleEmailChange} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Email
            </label>
            <input
              type="text"
              disabled
              value={user?.email || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Password (for verification)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Change Email Address"}
          </button>

          <p className="text-sm text-gray-600 mt-2">
            Note: You will need to verify your new email address before the
            change takes effect.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
