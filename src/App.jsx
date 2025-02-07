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
//       <div className="flex flex-col items-center p-4">
//         {/* Radio-style navigation buttons */}
//         <img src="./src/assets/jls.svg" alt="" />
//         <div className=" flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none mb-8">
//           <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
//             <NavLink
//               to="/truck1"
//               className="tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
//             >
//               Truck 1
//             </NavLink>
//           </label>

//           <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
//             <NavLink
//               to="/truck2"
//               className="tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
//             >
//               Truck 2
//             </NavLink>
//           </label>

//           <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
//             <NavLink
//               to="/truck3"
//               className="tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
//             >
//               Truck 3
//             </NavLink>
//           </label>

//           <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
//             <NavLink
//               to="/truck4"
//               className="tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
//             >
//               Truck 4
//             </NavLink>
//           </label>

//           <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
//             <NavLink
//               to="/truck5"
//               className="tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
//             >
//               Truck 5
//             </NavLink>
//           </label>
//         </div>

//         {/* Routes for each truck */}
//         <Routes>
//           <Route path="/" element={<Truck1 />} /> {/* Default route */}
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
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
// Import your components
import Truck1 from "./Component/Truck1";
import Truck2 from "./Component/Truck2";
import Truck3 from "./Component/Truck3";
import Truck4 from "./Component/Truck4";
import Truck5 from "./Component/Truck5";

function App() {
  return (
    <Router>
      {/* Main container with gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center p-4">
        {/* Top navigation bar with limited width */}
        <div className="w-full max-w-4xl bg-gray-300 p-4 rounded-lg mb-8 flex items-center justify-between">
          {/* Logo on the left */}
          <img
            src="./src/assets/jls.svg"
            alt="Logo"
            className="w-45 h-16" // Adjust size as needed
          />
          {/* Compact and centered truck navigation buttons */}
          <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
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
        </div>

        {/* Routes for each truck */}
        <Routes>
          <Route path="/" element={<Truck1 />} />{" "}
          {/* Default route (Truck 1) */}
          <Route path="/truck1" element={<Truck1 />} />
          <Route path="/truck2" element={<Truck2 />} />
          <Route path="/truck3" element={<Truck3 />} />
          <Route path="/truck4" element={<Truck4 />} />
          <Route path="/truck5" element={<Truck5 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
