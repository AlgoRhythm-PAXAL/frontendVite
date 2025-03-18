// // // import { Link } from "react-router-dom";

// // // const Navbar = () => {
// // //   return (
// // //     <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
// // //       {/* Logo */}
// // //       <div className="flex items-center">
// // //         <img src="/logo.jpg" alt="Logo" className="h-10" />
// // //       </div>

// // //       {/* Navigation Links */}
// // //       <ul className="flex space-x-6 text-gray-800">
// // //         <li><a href="#" className="px-4 py-2 rounded-full bg-teal-700 text-white">Home</a></li>
// // //         <li><a href="#" className="hover:text-teal-700">Contact Us</a></li>
// // //         <li><a href="#" className="hover:text-teal-700">About Us</a></li>
// // //       </ul>

// // //       {/* Auth Buttons */}
// // //       <div className="flex space-x-4">
// // //         <Link to="/signup">
// // //         <button className="px-4 py-2 bg-teal-700 text-white rounded-full">Sign up for free</button></Link>
// // //         <Link to="/login">
// // //         <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-full">Log in</button></Link>
// // //       </div>
// // //     </nav>
// // //   );
// // // }

// // // export default Navbar;
// // import { useContext } from "react";
// // import { AuthContext } from "../../contexts/AuthContext";
// // import { Link } from "react-router-dom";

// // const Navbar = () => {
// //   const { isAuthenticated, logout } = useContext(AuthContext);

// //   return (
// //     <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-t-4 border-purple-500">
// //       {/* Logo */}
// //       <div className="flex items-center">
// //         <img src="/logo.jpg" alt="Logo" className="h-10" />
// //       </div>

// //       {/* Navigation Links */}
// //       <ul className="flex space-x-6 text-gray-800">
// //         <li>
// //           <Link to="/" className="px-4 py-2 rounded-full bg-teal-700 text-white">Home</Link>
// //         </li>
// //         {isAuthenticated && (
// //           <>
// //             <li><Link to="/parcel" className="hover:text-teal-700">Parcel</Link></li>
// //             <li><Link to="/track" className="hover:text-teal-700">Track</Link></li>
// //           </>
// //         )}
// //         <li><Link to="/contact" className="hover:text-teal-700">Contact Us</Link></li>
// //         <li><Link to="/about" className="hover:text-teal-700">About Us</Link></li>
// //       </ul>

// //       {/* Right Section: Auth Buttons OR Avatar */}
// //       <div className="flex items-center space-x-4">
// //         {isAuthenticated ? (
// //           <>
// //             {/* Profile Avatar */}
// //             <Link to="/profile">
// //               <img
// //                 src="/avatar.png"  // Replace with actual user profile image
// //                 alt="Profile"
// //                 className="h-10 w-10 rounded-full border-2 border-gray-300"
// //               />
// //             </Link>
// //             <button
// //                onClick={logout}
// //               className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
// //             >
// //               Logout
// //             </button>
// //           </>
// //         ) : (
// //           <>
// //             <Link to="/signup">
// //               <button className="px-4 py-2 bg-teal-700 text-white rounded-full">Sign up for free</button>
// //             </Link>
// //             <Link to="/login">
// //               <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-full">Log in</button>
// //             </Link>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../contexts/AuthContext";
// import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Import icons

// const Navbar = () => {
//   const { isAuthenticated, logout } = useContext(AuthContext);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-t-4 border-white-500">
//       {/* Logo */}
//       <div className="flex items-center">
//         <img src="/logo.jpg" alt="Logo" className="h-10" />
//       </div>

//       {/* Navigation Links */}
//       <ul className="flex space-x-6 text-gray-800">
//         <li>
//           <Link to="/" className="px-4 py-2 rounded-full bg-teal-700 text-white">Home</Link>
//         </li>
//         {isAuthenticated && (
//           <>
//             <li><Link to="/addparcel" className="hover:text-teal-700">Parcel</Link></li>
//             <li><Link to="/track" className="hover:text-teal-700">Track</Link></li>
//           </>
//         )}
//         <li><Link to="/contact" className="hover:text-teal-700">Contact Us</Link></li>
//         <li><Link to="/about" className="hover:text-teal-700">About Us</Link></li>
//       </ul>

//       {/* Right Section: Auth Buttons OR Avatar */}
//       <div className="relative">
//         {isAuthenticated ? (
//           <div className="relative">
//             {/* Avatar button to toggle dropdown */}
//             <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
//               <img
//                 src="/avatar.png"  // Replace with actual user profile image
//                 alt="Profile"
//                 className="h-10 w-10 rounded-full border-2 border-gray-300 cursor-pointer"
//               />
//             </button>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
//                 <ul className="py-2">
//                   {/* Profile Option */}
//                   <li>
//                     <Link
//                       to="/profile"
//                       className="flex items-center px-4 py-2 hover:border-l-4 hover:border-green-500 hover:bg-gray-100"
//                       onClick={() => setDropdownOpen(false)}
//                     >
//                       <FaUser className="mr-2 text-gray-600" />
//                       Profile
//                     </Link>
//                   </li>
//                   {/* Logout Option */}
//                   <li>
//                     <button
//                       onClick={() => {
//                         logout();
//                         setDropdownOpen(false);
//                       }}
//                       className="w-full flex items-center px-4 py-2 hover:border-l-4 hover:border-green-500 hover:bg-gray-100 text-left"
//                     >
//                       <FaSignOutAlt className="mr-2 text-red-600" />
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex space-x-4">
//             <Link to="/signup">
//               <button className="px-4 py-2 bg-teal-700 text-white rounded-full">Sign up for free</button>
//             </Link>
//             <Link to="/login">
//               <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-full">Log in</button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









import { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Import icons

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-t-4 border-white-500">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.jpg" alt="Logo" className="h-10" />
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-800">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) =>
              isActive ? "px-4 py-2 rounded-full bg-teal-700 text-white" : "hover:text-teal-700"
            }
          >
            Home
          </NavLink>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <NavLink 
                to="/addparcel" 
                className={({ isActive }) =>
                  isActive ? "px-4 py-2 rounded-full bg-teal-700 text-white" : "hover:text-teal-700"
                }
              >
                Parcel
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/track" 
                className={({ isActive }) =>
                  isActive ? "px-4 py-2 rounded-full bg-teal-700 text-white" : "hover:text-teal-700"
                }
              >
                Track
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) =>
              isActive ? "px-4 py-2 rounded-full bg-teal-700 text-white" : "hover:text-teal-700"
            }
          >
            Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) =>
              isActive ? "px-4 py-2 rounded-full bg-teal-700 text-white" : "hover:text-teal-700"
            }
          >
            About Us
          </NavLink>
        </li>
      </ul>

      {/* Right Section: Auth Buttons OR Avatar */}
      <div className="relative">
        {isAuthenticated ? (
          <div className="relative">
            {/* Avatar button to toggle dropdown */}
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
              <img
                src="/avatar.png"  // Replace with actual user profile image
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-gray-300 cursor-pointer"
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
                <ul className="py-2">
                  {/* Profile Option */}
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:border-l-4 hover:border-green-500 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="mr-2 text-gray-600" />
                      Profile
                    </Link>
                  </li>
                  {/* Logout Option */}
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 hover:border-l-4 hover:border-green-500 hover:bg-gray-100 text-left"
                    >
                      <FaSignOutAlt className="mr-2 text-red-600" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/signup">
              <button className="px-4 py-2 bg-teal-700 text-white rounded-full">Sign up for free</button>
            </Link>
            <Link to="/login">
              <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-full">Log in</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

