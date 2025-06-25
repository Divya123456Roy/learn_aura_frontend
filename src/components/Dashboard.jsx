import React, { useState, useMemo, useCallback } from 'react';
import { Loader2, AlertCircle, Users, BookOpen, GraduationCap, Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
// Update API imports
import { getAdminDashboardDataAPI, getAdminSummaryCountsAPI } from '../services/courseAPI'; // Use combined or separate API
import { fetchAllUsers, fetchAllStudents } from '../services/adminAPI'; // Keep for now if needed for instructor/student counts
import { debounce } from 'lodash'; // Import debounce

// --- Sidebar Component (Remains the same) ---
function Sidebar() {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
        console.log("User has been logged out successfully.");
    };

    return (
        <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col space-y-6 h-screen sticky top-0"> {/* Make sidebar sticky */}
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <nav className="flex flex-col space-y-4">
                <Link to="/admin/admin-dashboard" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link>
                <div className="relative">
                    <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="w-full text-left hover:bg-blue-700 p-2 rounded flex justify-between items-center"
                    >
                        User Management <span>▾</span>
                    </button>
                    {userDropdownOpen && (
                        <div className="mt-1 w-full bg-blue-700 rounded shadow-md py-1">
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

// --- Admin Layout Component (Remains the same) ---
function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100"> {/* Use min-h-screen */}
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10">{children}</main> {/* Add more padding */}
        </div>
    );
}

// --- Course Details Modal Component ---
function CourseDetailsModal({ course, isOpen, onClose }) {
    if (!isOpen || !course) return null;

    // Helper to safely access nested instructor properties
    const getInstructorName = (instructor) => {
        if (!instructor) return 'N/A';
        return `${instructor.profile?.firstName || ''} ${instructor.profile?.lastName || ''}`.trim() || instructor.username || 'Unnamed Instructor';
    };
    const instructorName = getInstructorName(course.instructorId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                {/* Modal Header */}
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-blue-900">{course.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">Instructor: <span className="font-semibold">{instructorName}</span></p>
                    <p className="text-sm text-gray-500">Category: {course.category || 'N/A'} | Price: ${course.price?.toFixed(2) ?? 'Free'}</p>
                </div>

                {/* Modal Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        {course.courseImage && (
                            <img src={course.courseImage} alt={course.title} className="rounded-md mb-4 w-full object-cover aspect-video shadow-md" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-700 text-sm mb-4">{course.description || 'No description provided.'}</p>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                        {course.tags?.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 text-sm mb-4">No tags.</p>}

                         <h3 className="text-lg font-semibold text-gray-800 mb-2">Prerequisites</h3>
                         {course.prerequisites?.length > 0 ? (
                             <ul className="list-disc list-inside text-gray-700 text-sm mb-4">
                                 {course.prerequisites.map((prereq, index) => <li key={index}>{prereq}</li>)}
                             </ul>
                         ) : <p className="text-gray-500 text-sm mb-4">None specified.</p>}

                    </div>

                     {/* Right Column */}
                     <div>
                         <h3 className="text-lg font-semibold text-gray-800 mb-2">What You'll Learn</h3>
                         {course.whatYoullLearn?.length > 0 ? (
                             <ul className="list-disc list-inside text-gray-700 text-sm mb-4 space-y-1">
                                 {course.whatYoullLearn.map((item, index) => <li key={index}>{item}</li>)}
                             </ul>
                         ) : <p className="text-gray-500 text-sm mb-4">Learning outcomes not specified.</p>}

                         <h3 className="text-lg font-semibold text-gray-800 mb-2">Highlights</h3>
                         {course.highlights?.length > 0 ? (
                             <ul className="list-disc list-inside text-gray-700 text-sm mb-4 space-y-1">
                                 {course.highlights.map((item, index) => <li key={index}>{item}</li>)}
                             </ul>
                         ) : <p className="text-gray-500 text-sm mb-4">No highlights provided.</p>}

                         <h3 className="text-lg font-semibold text-gray-800 mb-2">Enrollment</h3>
                         <p className="text-gray-700 text-sm mb-4">
                            Current Enrollment Count: <span className='font-bold'>{course.enrollmentCount ?? 0}</span> {/* Using enrollmentCount from schema */}
                         </p>
                         <p className="text-gray-700 text-sm mb-4">
                            Students Array Length: <span className='font-bold'>{course.students?.length ?? 0}</span> {/* Number of student refs */}
                         </p>

                         {/* You could add more details like Modules list here if populated */}
                     </div>
                </div>

                 {/* Modal Footer (Optional) */}
                 <div className="p-4 bg-gray-50 border-t text-right rounded-b-lg">
                     <button
                         onClick={onClose}
                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                     >
                         Close
                     </button>
                 </div>
            </div>
        </div>
    );
}


// --- Dashboard Content Component ---
function DashboardContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const limit = 4; // Items per page

    // Debounce search input
    const debouncedSearch = useCallback(
        debounce((value) => {
            setDebouncedSearchTerm(value);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500), // 500ms delay
        [] // dependencies
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

     // Query for Summary Data (Option 1: Use separate endpoint)
     const { data: summaryData, isLoading: loadingSummary, isError: errorSummary } = useQuery({
        queryKey: ['adminSummaryCounts'],
        queryFn: getAdminSummaryCountsAPI, // Use the dedicated summary API
        staleTime: 5 * 60 * 1000, // Optional: Cache summary data for 5 mins
     });

    // Query for Paginated Course List
    // It depends on `currentPage` and `debouncedSearchTerm`
    const { data: courseData, isLoading: loadingCourses, isError: errorCourses, refetch } = useQuery({
        queryKey: ['paginatedCourses', currentPage, debouncedSearchTerm], // Key includes dependencies
        queryFn: () => getAdminDashboardDataAPI(currentPage, limit, debouncedSearchTerm), // Pass params to API call
        keepPreviousData: true, // Keep showing old data while fetching new page
    });

    // Extract data (handle potential undefined states)
    const courses = courseData?.list?.courses || [];
    const totalPages = courseData?.list?.totalPages || 1;
    const totalMatchingCourses = courseData?.list?.totalMatchingCourses || 0;

    // Option 2: If using the combined endpoint, get summary from courseData
    // const summaryFromCombined = courseData?.summary;
    // Use summaryFromCombined?.totalCourses instead of summaryData?.totalCourses if using combined endpoint


    // You might still need these for the User Management links or detailed views not covered here
    // const { data: instructors, isLoading: loadingInstructors, isError: errorInstructors } = useQuery({...});
    // const { data: students, isLoading: loadingStudents, isError: errorStudents } = useQuery({...});

    const isLoading = loadingSummary || loadingCourses; // Combine loading states
    const isError = errorSummary || errorCourses; // Combine error states

    // Helper to get instructor name from populated data
    const getInstructorName = (instructor) => {
         if (!instructor) return 'N/A';
         return `${instructor.profile?.firstName || ''} ${instructor.profile?.lastName || ''}`.trim() || instructor.username || 'Error: Missing Name';
     };

    const handleRowClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 p-0 md:p-4 lg:p-10"> {/* Adjusted padding */}
            <div className="max-w-7xl mx-auto"> {/* Increased max-width */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-blue-900 mb-8 md:mb-12 drop-shadow-md">
                    📊 Education Platform Report
                </h1>

                {/* --- Summary Section --- */}
                 {loadingSummary ? (
                    <div className="text-center p-4">Loading summary...</div>
                 ) : errorSummary ? (
                     <div className="text-center text-red-600 p-4">Failed to load summary data.</div>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                         <div className="bg-white shadow-xl rounded-xl p-6 flex items-center gap-4 border border-blue-100 transition transform hover:scale-105">
                             <BookOpen className="w-10 h-10 text-blue-600" />
                             <div>
                                 <p className="text-lg font-semibold text-gray-700">Total Courses</p>
                                 {/* Use total from summary data */}
                                 <p className="text-2xl font-bold text-blue-800">{summaryData?.totalCourses ?? '...'}</p>
                             </div>
                         </div>
                         <div className="bg-white shadow-xl rounded-xl p-6 flex items-center gap-4 border border-green-100 transition transform hover:scale-105">
                             <Users className="w-10 h-10 text-green-600" />
                             <div>
                                 <p className="text-lg font-semibold text-gray-700">Total Instructors</p>
                                 {/* Use total from summary data */}
                                 <p className="text-2xl font-bold text-green-800">{summaryData?.totalInstructors ?? '...'}</p>
                             </div>
                         </div>
                         <div className="bg-white shadow-xl rounded-xl p-6 flex items-center gap-4 border border-purple-100 transition transform hover:scale-105">
                             <GraduationCap className="w-10 h-10 text-purple-600" />
                             <div>
                                 <p className="text-lg font-semibold text-gray-700">Total Students</p>
                                 {/* Use total from summary data */}
                                 <p className="text-2xl font-bold text-purple-800">{summaryData?.totalStudents ?? '...'}</p>
                             </div>
                         </div>
                     </div>
                 )}


                {/* --- Course List Section --- */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
                     {/* Search Bar */}
                    <div className="p-4 border-b bg-gray-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses by title or tag..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* Table and Loading/Error States */}
                     {loadingCourses && !courseData ? ( // Show loading only on initial load or full refetch without previous data
                         <div className="flex justify-center items-center h-60 text-blue-600">
                             <Loader2 className="animate-spin w-10 h-10" />
                             <span className="ml-4 text-xl font-semibold">Loading courses...</span>
                         </div>
                     ) : errorCourses ? (
                         <div className="flex justify-center items-center h-40 text-red-600 p-4">
                             <AlertCircle className="w-6 h-6 mr-2" />
                             <span className="text-lg">Failed to load courses.</span>
                         </div>
                     ) : (
                         <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto text-left min-w-[600px]"> {/* Min width for smaller screens */}
                                    <thead className="bg-blue-100 text-blue-800 text-sm md:text-md font-bold tracking-wide uppercase">
                                        <tr>
                                            <th className="py-4 px-6">Course Title</th>
                                            <th className="py-4 px-6">Instructor</th>
                                            <th className="py-4 px-6 text-center">Students</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 text-sm md:text-base">
                                        {courses.length > 0 ? (
                                            courses.map((course) => (
                                                <tr
                                                    key={course._id}
                                                    className="border-t hover:bg-blue-50 transition-all duration-200 ease-in-out cursor-pointer"
                                                    onClick={() => handleRowClick(course)} // Add click handler
                                                >
                                                    <td className="py-4 px-6 font-medium">{course.title}</td>
                                                    {/* Use populated instructor data */}
                                                    <td className="py-4 px-6">{getInstructorName(course.instructorId)}</td>
                                                    {/* Use students array length from schema */}
                                                    <td className="py-4 px-6 text-center font-bold text-blue-700">
                                                        {course.students?.length ?? 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-6 px-6 text-center text-gray-500">
                                                    {debouncedSearchTerm ? `No courses found matching "${debouncedSearchTerm}".` : 'No courses available.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                             {/* Pagination Controls */}
                             {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t bg-gray-50 text-sm">
                                     <p className="text-gray-600 mb-2 sm:mb-0">
                                        Showing page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span> ({totalMatchingCourses} results)
                                    </p>
                                     <div className="flex items-center space-x-2">
                                         <button
                                             onClick={() => handlePageChange(currentPage - 1)}
                                             disabled={currentPage === 1 || loadingCourses}
                                             className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                         >
                                             Previous
                                         </button>
                                         {/* Optional: Page number buttons (can get complex) */}
                                         <span className="px-3 py-1 border border-gray-300 bg-white rounded">{currentPage}</span>
                                         <button
                                             onClick={() => handlePageChange(currentPage + 1)}
                                             disabled={currentPage === totalPages || loadingCourses}
                                             className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                         >
                                             Next
                                         </button>
                                     </div>
                                 </div>
                             )}
                         </>
                     )}
                </div>

                 {/* Removed the old "View Details" button */}
            </div>

            {/* Course Details Modal */}
            <CourseDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                course={selectedCourse}
            />
        </div>
    );
};

// --- Main Admin Dashboard Component ---
export default function Dashboard() {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
}