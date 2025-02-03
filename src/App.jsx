// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

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
//         {/* Buttons to navigate to each truck */}
//         <div className="flex space-x-4 mb-8">
//           <Link to="/truck1">
//             <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
//               Truck 1
//             </button>
//           </Link>
//           <Link to="/truck2">
//             <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
//               Truck 2
//             </button>
//           </Link>
//           <Link to="/truck3">
//             <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
//               Truck 3
//             </button>
//           </Link>
//           <Link to="/truck4">
//             <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
//               Truck 4
//             </button>
//           </Link>
//           <Link to="/truck5">
//             <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
//               Truck 5
//             </button>
//           </Link>
//         </div>

//         {/* Routes for each truck */}
//         <Routes>
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
      <div className="flex flex-col items-center p-4">
        {/* Buttons to navigate to each truck with active link styling */}
        <div className="flex space-x-4 mb-8">
          <NavLink
            to="/truck1"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-700 text-white py-2 px-4 rounded-md"
                : "bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            }
          >
            Truck 1
          </NavLink>
          <NavLink
            to="/truck2"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-700 text-white py-2 px-4 rounded-md"
                : "bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            }
          >
            Truck 2
          </NavLink>
          <NavLink
            to="/truck3"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-700 text-white py-2 px-4 rounded-md"
                : "bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            }
          >
            Truck 3
          </NavLink>
          <NavLink
            to="/truck4"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-700 text-white py-2 px-4 rounded-md"
                : "bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            }
          >
            Truck 4
          </NavLink>
          <NavLink
            to="/truck5"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-700 text-white py-2 px-4 rounded-md"
                : "bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            }
          >
            Truck 5
          </NavLink>
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
