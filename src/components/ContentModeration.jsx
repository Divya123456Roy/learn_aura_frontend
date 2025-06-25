import { useState } from "react";
import { Link } from "react-router-dom";

// Sample reported content
const reportedContent = [
  { id: 1, user: "JohnDoe", content: "Spam message here...", status: "Pending" },
  { id: 2, user: "JaneSmith", content: "Offensive language used", status: "Pending" },
  { id: 3, user: "MarkLee", content: "Plagiarized content", status: "Pending" },
];

/// Sidebar Component with Dropdown for User Management
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
        
        <Link to="/admin/group-management" className="hover:bg-blue-700 p-2 rounded">Group Management</Link>
        <Link to="/admin/content-moderation" className="hover:bg-blue-700 p-2 rounded">Content Moderation</Link>
        <Link to="/admin/platform-analytics" className="hover:bg-blue-700 p-2 rounded">Platform Analytics</Link>
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

// Content Moderation Component
export default function ContentModeration() {
  const [contentList, setContentList] = useState(reportedContent);
  const [search, setSearch] = useState("");

  // Approve content
  const handleApprove = (id) => {
    setContentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    );
  };

  // Delete content
  const handleDelete = (id) => {
    setContentList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">LearnAura Content Moderation</h2>
        <input
          type="text"
          placeholder="Search reported content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full p-3 border rounded shadow-sm"
        />
        <div className="space-y-6">
          {contentList
            .filter((item) => item.content.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div key={item.id} className="p-6 bg-gray-50 shadow-lg rounded-lg border">
                <p className="text-gray-700"><strong>User:</strong> {item.user}</p>
                <p className="text-gray-900 mt-3 text-lg">{item.content}</p>
                <p className={`mt-2 text-sm font-semibold ${item.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                  Status: {item.status}
                </p>
                <div className="mt-4 flex space-x-4">
                  <button onClick={() => handleApprove(item.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md">
                    Approve
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md">
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
