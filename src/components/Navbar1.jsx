import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaBars, FaTimes, FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsAPI } from "../services/notificationServices";

export default function Navbar1() {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryFn: getNotificationsAPI,
    queryKey: ["notification-number"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
    console.log("User has been logged out successfully.");
  };

  return (
    <aside className={`h-screen w-64 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-md flex flex-col p-8`}>
      {/* Logo & Top Icons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaBook className="text-blue-500" /> LearnAura
        </h1>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative group">
            <Link to="/student/notifications" className="p-1">
              <Bell className="w-7 h-7 text-red-500 transition-colors duration-300 group-hover:text-red-600" />
              {notifications?.pagination.totalNotifications > 0 && (
                <span className="absolute top-[-5px] right-[-5px] bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  {notifications?.pagination.totalNotifications}
                </span>
              )}
            </Link>
          </div>

          {/* Sidebar Toggle (only on mobile) */}
          <button className="text-2xl md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`flex flex-col ${isOpen ? "block" : "hidden"} xs:block`}>
        <Link to="/student/feed" className="py-3 px-4 rounded-md hover:bg-blue-500 hover:text-white mb-2">🏠 Feed</Link>
        <Link to="/student/chat-messaging" className="py-3 px-4 rounded-md hover:bg-blue-500 hover:text-white mb-2">💬 Chat</Link>
        <Link to="/student/browse-course" className="py-3 px-4 rounded-md hover:bg-blue-500 hover:text-white mb-2">📚 Course</Link>
        {/* <Link to="/student/discussion" className="py-3 px-4 rounded-md hover:bg-blue-500 hover:text-white mb-2">💡 Discussion</Link> */}
        <Link to="/student/profile" className="py-3 px-4 rounded-md hover:bg-blue-500 hover:text-white mb-2">👤 Profile</Link>
      </nav>

      {/* Logout Button */}
      <button
        className="mt-auto py-3 px-4 rounded-md flex items-center justify-center bg-red-600 text-white hover:bg-red-500"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>

      {/* Dark Mode Toggle */}
      <button
        className="mt-3 py-3 px-4 rounded-md flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700"
        onClick={toggleDarkMode}
      >
        {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />} Toggle Theme
      </button>
    </aside>
  );
}
