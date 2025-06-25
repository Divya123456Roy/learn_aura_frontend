import { useState } from "react";
import { FaTrash, FaUserShield,FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// ✅ Sidebar Component (With Dropdown for User Management)
function Sidebar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    sessionStorage.removeItem("token");   // Remove auth token
    sessionStorage.removeItem("user");  // Remove user data

    // Redirect to login page
    navigate("/");

    console.log("User has been logged out successfully.");
  };

  return (
    <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>

        {/* Dropdown for User Management */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            User Management ▾
          </button>
          {userDropdownOpen && (
            <div className="absolute left-0 mt-1 w-full bg-blue-700 rounded shadow-md">
              <Link to="/admin/student-view" className="block px-4 py-2 hover:bg-blue-600">Students</Link>
              <Link to="/admin/professional-view" className="block px-4 py-2 hover:bg-blue-600">Professionals</Link>
            </div>
          )}
        </div>

        {/* <Link to="/admin/group-management" className="hover:bg-blue-700 p-2 rounded">Group Management</Link>
        <Link to="/admin/content-moderation" className="hover:bg-blue-700 p-2 rounded">Content Moderation</Link> */}
        <Link to="/admin/view-all" className="hover:bg-blue-700 p-2 rounded">Platform Analytics</Link>
      </nav>

      {/* Logout Button */}
      <button
        className="mt-auto py-3 px-4 rounded-md flex items-center justify-center bg-red-600 text-white hover:bg-red-500"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </aside>
  );
}
// Admin Layout Component
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}

export default AdminLayout;
