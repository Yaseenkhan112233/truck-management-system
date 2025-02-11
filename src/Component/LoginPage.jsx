// import React, { useState } from "react";

// const Login = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Simulate a static check for valid credentials
//     if (
//       credentials.username === "admin" &&
//       credentials.password === "password"
//     ) {
//       // Simulate an auth token (in a real app, this would come from the backend)
//       const authToken = "fake-auth-token-12345";

//       // Save the auth token to localStorage
//       localStorage.setItem("authToken", authToken);

//       // Clear the form fields
//       setCredentials({
//         username: "",
//         password: "",
//       });

//       // Call the onLogin function passed as a prop
//       onLogin();
//     } else {
//       // Set error state if credentials are invalid
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
//         <div className="space-y-6">
//           {/* Logo */}
//           <div className="flex justify-center mb-4">
//             <img src="./src/assets/jls.svg" alt="Logo" className="w-32 h-12" />
//           </div>
//           {/* Title */}
//           <h2 className="text-2xl font-bold text-center text-gray-900">
//             Login
//           </h2>
//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={credentials.username}
//                 onChange={(e) =>
//                   setCredentials({ ...credentials, username: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//             <div className="space-y-2">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={credentials.password}
//                 onChange={(e) =>
//                   setCredentials({ ...credentials, password: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//             {/* Error Message */}
//             {error && (
//               <div className="text-red-500 text-sm text-center">{error}</div>
//             )}
//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//             >
//               Sign In
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a static check for valid credentials
    if (
      credentials.username === "jlt@gmail.com" &&
      credentials.password === "jltTransport"
    ) {
      // Simulate an auth token (in a real app, this would come from the backend)
      const authToken = "fake-auth-token-12345";

      // Save the auth token to localStorage
      localStorage.setItem("authToken", authToken);

      // Clear the form fields
      setCredentials({
        username: "",
        password: "",
      });

      // Call the onLogin function passed as a prop
      onLogin();
    } else {
      // Set error state if credentials are invalid
      setError("Invalid credentials");
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
            Login
          </h2>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
