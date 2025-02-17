// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   NavLink,
// } from "react-router-dom";
// // Import your components
// import Truck1 from "./Component/Truck1";
// import Truck2 from "./Component/Truck2";
// import Truck3 from "./Component/Truck3";
// import Truck4 from "./Component/Truck4";
// import Truck5 from "./Component/Truck5";

// function App() {
//   return (
//     <Router>
//       {/* Main container with gradient background */}
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center p-4">
//         {/* Top navigation bar with limited width */}
//         <div className="w-full max-w-4xl bg-gray-300 p-4 rounded-lg mb-8 flex items-center justify-between">
//           {/* Logo on the left */}
//           <img
//             src="./src/assets/jls.svg"
//             alt="Logo"
//             className="w-45 h-16" // Adjust size as needed
//           />
//           {/* Compact and centered truck navigation buttons */}
//           <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
//             {[1, 2, 3, 4, 5].map((truck) => (
//               <label
//                 key={truck}
//                 className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer"
//               >
//                 <NavLink
//                   to={`/truck${truck}`}
//                   className={({ isActive }) =>
//                     isActive
//                       ? "tracking-widest text-white bg-purple-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
//                       : "tracking-widest text-gray-700 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
//                   }
//                 >
//                   Truck {truck}
//                 </NavLink>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Routes for each truck */}
//         <Routes>
//           <Route path="/" element={<Truck1 />} />{" "}
//           {/* Default route (Truck 1) */}
//           <Route path="/truck1" element={<Truck1 />} />
//           <Route path="/truck2" element={<Truck2 />} />
//           <Route path="/truck3" element={<Truck3 />} />
//           <Route path="/truck4" element={<Truck4 />} />
//           <Route path="/truck5" element={<Truck5 />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   NavLink,
//   Navigate,
// } from "react-router-dom";
// // Import your components
// import Login from "./Component/LoginPage";
// import Truck1 from "./Component/Truck1";
// import Truck2 from "./Component/Truck2";
// import Truck3 from "./Component/Truck3";
// import Truck4 from "./Component/Truck4";
// import Truck5 from "./Component/Truck5";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   // Protected Route wrapper component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/login"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/" />
//             ) : (
//               <Login onLogin={handleLogin} />
//             )
//           }
//         />

//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute>
//               <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center p-4">
//                 <div className="w-full max-w-4xl bg-gray-300 p-4 rounded-lg mb-8 flex items-center justify-between">
//                   <img
//                     src="./src/assets/jls.svg"
//                     alt="Logo"
//                     className="w-45 h-16"
//                   />
//                   <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
//                     {[1, 2, 3, 4, 5].map((truck) => (
//                       <label
//                         key={truck}
//                         className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer"
//                       >
//                         <NavLink
//                           to={`/truck${truck}`}
//                           className={({ isActive }) =>
//                             isActive
//                               ? "tracking-widest text-white bg-purple-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
//                               : "tracking-widest text-gray-700 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
//                           }
//                         >
//                           Truck {truck}
//                         </NavLink>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <Routes>
//                   <Route path="/" element={<Truck1 />} />
//                   <Route path="/truck1" element={<Truck1 />} />
//                   <Route path="/truck2" element={<Truck2 />} />
//                   <Route path="/truck3" element={<Truck3 />} />
//                   <Route path="/truck4" element={<Truck4 />} />
//                   <Route path="/truck5" element={<Truck5 />} />
//                 </Routes>
//               </div>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
} from "react-router-dom";

// Import your components
import Login from "./Component/LoginPage";
import Truck1 from "./Component/Truck1";
import Truck2 from "./Component/Truck2";
import Truck3 from "./Component/Truck3";
import Truck4 from "./Component/Truck4";
import Truck5 from "./Component/Truck5";

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for auth token on app load
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = () => {
    const authToken = "fake-auth-token-12345"; // Simulate an auth token
    localStorage.setItem("authToken", authToken); // Save the token
    setIsAuthenticated(true); // Update authentication state
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    setIsAuthenticated(false); // Update authentication state
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/truck1" />
            ) : (
              <Login onLogin={handleLogin} />
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
                <div className="w-full max-w-4xl bg-gray-300 p-4 rounded-lg mb-8 flex items-center justify-between">
                  <img src="/Images/jls.svg" alt="Logo" className="w-45 h-16" />
                  <div className="flex space-x-2 border-[3px] border-green-600 rounded-xl select-none">
                    {[1, 2, 3, 4, 5].map((truck) => (
                      <label
                        key={truck}
                        className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer"
                      >
                        <NavLink
                          to={`/truck${truck}`}
                          className={({ isActive }) =>
                            isActive
                              ? "tracking-widest text-white bg-green-500 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
                              : "tracking-widest text-gray-700 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
                          }
                        >
                          Truck {truck}
                        </NavLink>
                      </label>
                    ))}
                  </div>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>

                {/* Nested Routes for Trucks */}
                <Routes>
                  {/* <Route path="/" element={<Truck1 />} /> */}
                  <Route path="/truck1" element={<Truck1 />} />
                  <Route path="/truck2" element={<Truck2 />} />
                  <Route path="/truck3" element={<Truck3 />} />
                  <Route path="/truck4" element={<Truck4 />} />
                  <Route path="/truck5" element={<Truck5 />} />
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
