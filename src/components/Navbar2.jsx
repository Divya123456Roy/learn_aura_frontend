import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaBars, FaTimes, FaSun, FaMoon, FaSignOutAlt, FaHome, FaCommentDots, FaUserCircle } from "react-icons/fa";
import { Bell } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsAPI } from "../services/notificationServices";

export default function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const {data:notifications} = useQuery({
    queryFn:getNotificationsAPI,
    queryKey:["notification-number"]
  })

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
    console.log("User has been logged out successfully.");
  };

  return (
    <header className={`w-full py-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-md`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FaBook className="text-blue-500 text-xl" /> LearnAura
        </h1>

        {/* Navigation and Actions */}
        <div className="flex items-center space-x-8">
          {/* Main Navigation Icons */}
          <ul className="md:flex md:items-center space-x-6 hidden">
            <li className="relative group">
              <Link to="/professional" className="hover:text-blue-600 transition-colors duration-300 flex items-center">
                <FaHome className="text-lg" />
                <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">Home</span>
              </Link>
            </li>
            <li className="relative group">
              <Link to="/professional/chat" className="hover:text-blue-600 transition-colors duration-300 flex items-center">
                <FaCommentDots className="text-lg" />
                <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">Chat</span>
              </Link>
            </li>
            <li className="relative group">
              <Link to="/professional/profile" className="hover:text-blue-600 transition-colors duration-300 flex items-center">
                <FaUserCircle className="text-lg" />
                <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">Profile</span>
              </Link>
            </li>
          </ul>

          {/* Secondary Actions */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <div className="relative group">
              <Link to="/professional/notification" className="px-3 py-2">
                <Bell className="w-7 h-7 text-red-500 transition-colors duration-300 group-hover:text-red-600" />
                {console.log(notifications?.pagination.totalNotifications)
                }
                {notifications?.pagination.totalNotifications > 0 && (
                  <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs mt-2 mr-2 font-bold px-2 py-1 rounded-full">
                    {notifications?.pagination.totalNotifications}
                  </span>
                )}
              </Link>
              <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">Notifications</span>
            </div>

            {/* Logout Button */}
            <button
              className="py-2 px-3 rounded-md flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 group relative"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-lg mr-1" />
              <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">Logout</span>
            </button>

            {/* Dark Mode Toggle */}
            <button className="text-2xl group relative transition-colors duration-300 hover:text-gray-500" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
              <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl ml-4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <ul className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md z-10 ${isOpen ? "block" : "hidden"}`}>
        <li className="relative group py-2 px-4 hover:bg-gray-100">
          <Link to="/professional" className="hover:text-blue-600 transition-colors duration-300 flex items-center gap-3">
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
        </li>
        <li className="relative group py-2 px-4 hover:bg-gray-100">
          <Link to="/professional/chat" className="hover:text-blue-600 transition-colors duration-300 flex items-center gap-3">
            <FaCommentDots className="text-lg" />
            <span>Chat</span>
          </Link>
        </li>
        <li className="relative group py-2 px-4 hover:bg-gray-100">
          <Link to="/professional/profile" className="hover:text-blue-600 transition-colors duration-300 flex items-center gap-3">
            <FaUserCircle className="text-lg" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </header>
  );
}