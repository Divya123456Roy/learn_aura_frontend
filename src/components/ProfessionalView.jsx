import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProfessionals } from "../services/adminservices";

// Sidebar Component (Reused for Admin Dashboard)
function Sidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>
        <Link to="/admin/user-management" className="hover:bg-blue-700 p-2 rounded">User Management</Link>
        <Link to="/admin/professional-view" className="hover:bg-blue-700 p-2 rounded bg-blue-700">Professionals</Link>
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
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

// Professional View Page
export default function ProfessionalView() {
  const { data: professionals, isLoading, isError, error } = useQuery({
    queryKey: ["professionals"],
    queryFn: fetchProfessionals,
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Professional List</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="text-red-600 bg-red-100 p-4 rounded-md">
          {error?.message || "Failed to load professionals."}
        </div>
      ) : professionals?.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Sl. No</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {professionals
                ?.filter((professional) => professional?.role === "instructor") // Only show instructors
                ?.map((professional, index) => (
                  <tr key={professional?._id} className={`${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}>
                    <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="p-3 text-sm text-gray-700">{professional?.username}</td>
                    <td className="p-3 text-sm text-gray-700">{professional?.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg text-center">No professionals found.</p>
      )}
    </AdminLayout>
  );
}
