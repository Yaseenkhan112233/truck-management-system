import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
} from "react-router-dom";
import {
  onAuthStateChangedListener,
  signOutUser,
} from "../src/firabse/Fireabase";
import { User } from "lucide-react";

// Import your components
import Login from "./Component/LoginPage";
import ForgotPassword from "./Component/ForgotPassword";
import Registration from "./Component/Registration";
import UserSettings from "./Component/UserSettings"; // You'll need to create this component
import Truck1 from "./Component/Truck1";
import Truck2 from "./Component/Truck2";
import Truck3 from "./Component/Truck3";
import Truck4 from "./Component/Truck4";
import Truck5 from "./Component/Truck5";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Handle login
  const handleLogin = () => {
    // Additional logic after login if needed
  };

  // Handle registration
  const handleRegister = () => {
    // Additional logic after registration if needed
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem("authUser");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (loading)
      return (
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      );
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/truck1" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/truck1" />
            ) : (
              <Registration onRegister={handleRegister} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center p-4">
                {/* Header with Logo and Navigation */}
                <div className="w-full max-w-4xl bg-white shadow-md p-4 rounded-lg mb-8 flex items-center justify-between">
                  <img src="/Images/jls.svg" alt="Logo" className="w-32 h-12" />
                  <div className="flex space-x-2 border-[3px] border-purple-600 rounded-xl select-none">
                    {[1, 2, 3, 4, 5].map((truck) => (
                      <label
                        key={truck}
                        className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer"
                      >
                        <NavLink
                          to={`/truck${truck}`}
                          className={({ isActive }) =>
                            isActive
                              ? "tracking-widest text-white bg-purple-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
                              : "tracking-widest text-gray-700 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
                          }
                        >
                          Truck {truck}
                        </NavLink>
                      </label>
                    ))}
                  </div>
                  {/* User Email & Logout Button */}
                  <div className="flex items-center space-x-2 relative">
                    <div className="relative">
                      <button
                        onClick={toggleUserMenu}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors duration-150 p-2 rounded-md hover:bg-gray-100"
                      >
                        {/* <span>{user?.email}</span> */}
                        <User
                          color="#666" // Customize color (default: currentColor)
                          size={30} // Customize size (default: 24)
                        />

                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <NavLink
                              to="/settings"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Settings
                            </NavLink>
                            <button
                              onClick={() => {
                                handleLogout();
                                setShowUserMenu(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Standalone logout button if you prefer */}
                    {/* <button
                      onClick={handleLogout}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Logout
                    </button> */}
                  </div>
                </div>

                {/* Nested Routes for Trucks and User Settings */}
                <Routes>
                  <Route path="/" element={<Navigate to="/truck1" />} />
                  <Route path="/truck1" element={<Truck1 />} />
                  <Route path="/truck2" element={<Truck2 />} />
                  <Route path="/truck3" element={<Truck3 />} />
                  <Route path="/truck4" element={<Truck4 />} />
                  <Route path="/truck5" element={<Truck5 />} />
                  <Route
                    path="/settings"
                    element={<UserSettings user={user} />}
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/truck1" />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
