import React from "react"; // Removed useState, useEffect
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/Card"; // Assuming these exist
// import { Button } from "../components/Button"; // Removed Button import
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { FaSignOutAlt } from "react-icons/fa";
import { Loader2, AlertCircle } from 'lucide-react'; // For loading/error states
import { fetchAdminDashboardStats } from "../services/courseAPI";

// --- Sidebar Component (No Changes Needed) ---
function Sidebar() {
    const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
        console.log("User has been logged out successfully.");
    };

    return (
        <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen sticky top-0"> {/* Added sticky */}
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <nav className="flex flex-col space-y-4">
                <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>
                <div className="relative">
                    <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="w-full text-left hover:bg-blue-700 p-2 rounded flex justify-between items-center" // Added flex
                    >
                        User Management <span>▾</span>
                    </button>
                    {userDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-full bg-blue-700 rounded shadow-md py-1 z-10"> {/* Added z-index */}
                            <Link to="/admin/student-view" className="block px-4 py-2 hover:bg-blue-600">Students</Link>
                            <Link to="/admin/professional-view" className="block px-4 py-2 hover:bg-blue-600">Professionals</Link>
                        </div>
                    )}
                </div>
                <Link to="/admin/view-all" className="hover:bg-blue-700 p-2 rounded">Platform Analytics</Link>
            </nav>
            <button
                className="mt-auto py-3 px-4 rounded-md flex items-center justify-center bg-red-600 text-white hover:bg-red-500"
                onClick={handleLogout}
            >
                <FaSignOutAlt className="mr-2" /> Logout
            </button>
        </aside>
    );
}

// --- Admin Layout Component (No Changes Needed) ---
function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen"> {/* Use min-h-screen */}
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 bg-gray-100">{children}</main> {/* Adjusted padding */}
        </div>
    );
}

// --- Main Admin Dashboard Component ---
export default function AdminDashboard() {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
}

// --- Dashboard Content Component (Refactored) ---
function DashboardContent() {

    // Single query to fetch all dashboard stats
    const { data: dashboardStats, isLoading, isError, error } = useQuery({
        queryKey: ['adminDashboardStats'], // Unique key for this query
        queryFn: fetchAdminDashboardStats, // Use the new API function
        staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes
        refetchOnWindowFocus: false, // Optional: Prevent refetch on window focus
    });
    console.log(dashboardStats);
    

    const summary = dashboardStats?.summary;
    const growthData = dashboardStats?.growthData || []; // Default to empty array

    // Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
            <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                <p className="font-semibold text-gray-700">{`${label}`}</p>
                <p style={{ color: '#8884d8' }}>{`Users: ${payload[0].value}`}</p>
                <p style={{ color: '#82ca9d' }}>{`Courses: ${payload[1].value}`}</p>
            </div>
            );
        }
        return null;
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
                <span className="ml-4 text-xl font-semibold text-gray-700">Loading Dashboard...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen p-6 bg-red-50 rounded border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
                <p className="text-red-600 text-center">Could not fetch dashboard statistics. Please try again later.</p>
                {error?.message && <p className="mt-2 text-sm text-red-500">Details: {error.message}</p>}
            </div>
        );
    }

    return (
        <div className="p-0 md:p-4 lg:p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {/* Card Component Usage (assuming Card/CardContent structure) */}
                 <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-200">
                    <CardContent className="p-4">
                         <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-1">Total Instructors</h3>
                         <p className="text-2xl md:text-3xl font-bold text-blue-700">{summary?.totalInstructors ?? 'N/A'}</p>
                     </CardContent>
                 </Card>
                 <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-200">
                     <CardContent className="p-4">
                         <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-1">Total Students</h3>
                         <p className="text-2xl md:text-3xl font-bold text-green-700">{summary?.totalStudents ?? 'N/A'}</p>
                     </CardContent>
                 </Card>
                 <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-200">
                     <CardContent className="p-4">
                         <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-1">Total Courses</h3>
                         <p className="text-2xl md:text-3xl font-bold text-purple-700">{summary?.totalCourses ?? 'N/A'}</p>
                     </CardContent>
                 </Card>
                 <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-200">
                     <CardContent className="p-4">
                         <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-1">Active Enrollments</h3>
                         <p className="text-2xl md:text-3xl font-bold text-red-700">{summary?.activeEnrollments ?? 'N/A'}</p>
                     </CardContent>
                 </Card>
            </div>

            {/* User & Course Growth Chart */}
            <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">User & Course Growth (Last 12 Months)</h3>
                {growthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={growthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="New Users" dot={false} activeDot={{ r: 6 }}/>
                            <Line type="monotone" dataKey="courses" stroke="#82ca9d" strokeWidth={2} name="New Courses" dot={false} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-10">No growth data available for the selected period.</p>
                )}
            </div>

            {/* Manage Users & Courses Buttons Removed */}
            {/*
             <div className="mt-6 space-x-4">
               <Link to="/admin/user-management"><Button>Manage Users</Button></Link>
               <Link to="/admin/course-management"><Button>Manage Courses</Button></Link>
             </div>
            */}
        </div>
    );
}