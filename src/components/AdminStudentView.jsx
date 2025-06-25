import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentsAPI } from "../services/adminservices";


// Sidebar Component
function Sidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">
          Dashboard
        </Link>

        <div className="relative">
          <button className="w-full text-left hover:bg-blue-700 p-2 rounded">
            User Management ▾
          </button>
          <div className="mt-1 w-full bg-blue-700 rounded shadow-md">
            <Link to="/admin/student-view" className="block px-4 py-2 hover:bg-blue-600">
              Students
            </Link>
            <Link to="/admin/professional-view" className="block px-4 py-2 hover:bg-blue-600">
              Professionals
            </Link>
          </div>
        </div>

        {/* <Link to="/admin/group-management" className="hover:bg-blue-700 p-2 rounded">
          Group Management
        </Link>
        <Link to="/admin/content-moderation" className="hover:bg-blue-700 p-2 rounded">
          Content Moderation
        </Link> */}
        <Link to="/admin/view-all" className="hover:bg-blue-700 p-2 rounded">
          Platform Analytics
        </Link>
      </nav>
    </aside>
  );
}

// Admin Layout Component
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// Admin Student View Page
export default function AdminStudentView() {
  // Use useQuery to fetch students
  const { data: students, error, isLoading } = useQuery({
    queryKey: ["students"], // Unique key for this query
    queryFn: fetchStudentsAPI, // Function to fetch the data
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
        <p className="text-red-500 mb-4">{error.message || "Failed to fetch students"}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>

      {students.length === 0 ? (
        <p className="text-gray-600">No students found.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Sl. No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{student.username}</td>
                  <td className="p-4">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}