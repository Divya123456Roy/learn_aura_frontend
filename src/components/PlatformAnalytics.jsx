import { useState } from "react";
import { Link } from "react-router-dom";

// Sidebar Component with Dropdown for User Management
function Sidebar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>
        
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            User Management ▾
          </button>
          {userDropdownOpen && (
            <div className="absolute left-0 mt-1 w-full bg-blue-700 rounded shadow-md">
              <Link to="/admin/user-management/students" className="block px-4 py-2 hover:bg-blue-600">Students</Link>
              <Link to="/admin/user-management/professionals" className="block px-4 py-2 hover:bg-blue-600">Professionals</Link>
            </div>
          )}
        </div>
        
        {/* <Link to="/admin/group-management" className="hover:bg-blue-700 p-2 rounded">Group Management</Link>
        <Link to="/admin/content-moderation" className="hover:bg-blue-700 p-2 rounded">Content Moderation</Link> */}
        <Link to="/admin/view-all" className="hover:bg-blue-700 p-2 rounded">Platform Analytics</Link>
      </nav>
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

// Platform Analytics Component
export default function PlatformAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    users: 1500,
    activeUsers: 450,
    posts: 3200,
    reportedContent: 78,
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">LearnAura Platform Analytics</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-2xl text-blue-600 font-bold">{analyticsData.users}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Active Users</h3>
            <p className="text-2xl text-green-600 font-bold">{analyticsData.activeUsers}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Total Posts</h3>
            <p className="text-2xl text-purple-600 font-bold">{analyticsData.posts}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold">Reported Content</h3>
            <p className="text-2xl text-red-600 font-bold">{analyticsData.reportedContent}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
