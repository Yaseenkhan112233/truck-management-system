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
      <div className="flex flex-col items-center p-4">
        {/* Radio-style navigation buttons */}
        <div className="flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none mb-8">
          <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
            <NavLink
              to="/truck1"
              className={({ isActive }) =>
                isActive
                  ? "tracking-widest bg-gradient-to-r from-[blueviolet] to-[violet] text-white p-2 rounded-lg transition duration-150 ease-in-out"
                  : "tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
              }
            >
              Truck 1
            </NavLink>
          </label>

          <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
            <NavLink
              to="/truck2"
              className={({ isActive }) =>
                isActive
                  ? "tracking-widest bg-gradient-to-r from-[blueviolet] to-[violet] text-white p-2 rounded-lg transition duration-150 ease-in-out"
                  : "tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
              }
            >
              Truck 2
            </NavLink>
          </label>

          <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
            <NavLink
              to="/truck3"
              className={({ isActive }) =>
                isActive
                  ? "tracking-widest bg-gradient-to-r from-[blueviolet] to-[violet] text-white p-2 rounded-lg transition duration-150 ease-in-out"
                  : "tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
              }
            >
              Truck 3
            </NavLink>
          </label>

          <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
            <NavLink
              to="/truck4"
              className={({ isActive }) =>
                isActive
                  ? "tracking-widest bg-gradient-to-r from-[blueviolet] to-[violet] text-white p-2 rounded-lg transition duration-150 ease-in-out"
                  : "tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
              }
            >
              Truck 4
            </NavLink>
          </label>

          <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
            <NavLink
              to="/truck5"
              className={({ isActive }) =>
                isActive
                  ? "tracking-widest bg-gradient-to-r from-[blueviolet] to-[violet] text-white p-2 rounded-lg transition duration-150 ease-in-out"
                  : "tracking-widest text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out"
              }
            >
              Truck 5
            </NavLink>
          </label>
        </div>

        {/* Routes for each truck */}
        <Routes>
          <Route path="/" element={<Truck1 />} /> {/* Default route */}
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
