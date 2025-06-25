// src/components/BrowseCourses.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMyCoursesAPI } from "../services/courseAPI";

const BrowseCourses = () => {
  const [searchTermInput, setSearchTermInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['courses', searchTerm, currentPage],
    queryFn: () => fetchMyCoursesAPI(searchTerm, currentPage),
    keepPreviousData: true,
  });
  console.log(coursesData);
  

  const courses = coursesData?.courses || [];
  const totalPages = coursesData?.totalPages || 1;

  const handleInputChange = (event) => {
    setSearchTermInput(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchTerm(searchTermInput.trim().toLowerCase());
    setCurrentPage(1); // Reset to first page when doing new search
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); 
      // searchTerm and currentPage both are in queryKey so React Query will auto refetch
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 bg-gray-100 w-full min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3 bg-gray-100 min-h-screen text-red-500">
        {error?.message || "Failed to load courses."}
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-100 w-full min-h-screen">
      <h1 className="text-xl font-bold text-center w-full text-blue-600 mb-3">
        📚 Browse Courses
      </h1>

      {/* Search Bar */}
      <div className="max-w-md w-full mx-auto mb-3 flex">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full p-1.5 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mr-2"
          value={searchTermInput}
          onChange={handleInputChange}
        />
        <button
          onClick={handleSearchClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>

      {/* Display Courses */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        {courses.map((course) => (
          <button
            key={course._id}
            className="bg-white shadow-md p-3 rounded-md border border-gray-200 hover:shadow-lg transition-all max-w-sm w-full text-left"
            onClick={() => handleCourseClick(course._id)}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-0.5">{course.title}</h3>
            <p className="text-sm text-gray-700 mb-0.5">
              <span className="font-semibold">Price:</span> {course.price}
            </p>
            <p className="text-sm text-gray-700 mb-0.5">
              <span className="font-semibold">Category:</span> {course.category}
            </p>
            <p className="text-sm text-gray-700 mb-0.5">
            <span className="font-semibold">Instructor:</span> {course?.instructorId?.username}
                </p>
            {course.tags?.length > 0 && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Tags:</span> {course.tags.join(", ")}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 items-center gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">{currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {courses.length === 0 && !isLoading && !isError && (
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">No courses found.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
