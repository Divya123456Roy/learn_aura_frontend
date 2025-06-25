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
              <Link to="/admin/student-view" className="block px-4 py-2 hover:bg-blue-600">Students</Link>
              <Link to="/admin/professional-view" className="block px-4 py-2 hover:bg-blue-600">Professionals</Link>
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

// Group Management Component
export default function GroupManagement() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Web Development", members: 12, materials: 3 },
    { id: 2, name: "Data Science", members: 8, materials: 5 },
    { id: 3, name: "Cybersecurity", members: 10, materials: 2 },
  ]);

  const [newGroup, setNewGroup] = useState("");

  const handleAddGroup = () => {
    if (newGroup.trim() !== "") {
      setGroups([...groups, { id: Date.now(), name: newGroup, members: 1, materials: 0 }]);
      setNewGroup("");
    }
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Group Management</h2>

        {/* Add New Group */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter group name"
            className="border p-2 flex-1 rounded-md"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          />
          <button
            onClick={handleAddGroup}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Group
          </button>
        </div>

        {/* Group List */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                <p className="text-gray-600 text-sm">{group.members} Members | {group.materials} Materials</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                  Join
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
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
