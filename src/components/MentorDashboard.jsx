import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dashboardBg from "../assets/image/dashboard-bg.webp"; // Import background image
import { fetchMyCoursesAPI } from "../services/courseAPI";
import {
  EyeIcon,
  PlusIcon as CreateIcon,
  ListBulletIcon as ModuleIcon,
  MagnifyingGlassIcon, // Import search icon
} from "@heroicons/react/24/outline"; // Import icons

const MentorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all courses using useQuery
  const { data, error, isLoading } = useQuery({
    queryKey: ["courses", searchTerm], // Include searchTerm in the query key
    queryFn: () => fetchMyCoursesAPI(searchTerm), // Pass searchTerm to the API call
    keepPreviousData: true, // Keep showing previous data while new is loading
  });
  const courses = data?.courses;
  console.log(courses);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Mentor Dashboard</h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6 relative">
        <input
          type="text"
          className="w-full p-3 rounded-full border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-12"
          placeholder="Search courses by title or tag..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Display loading state */}
      {isLoading && <p className="text-black font-bold text-center">Loading courses...</p>}

      {/* Display error state */}
      {error && (
        <p className="text-red-500 text-center">
          {error.message || "Failed to fetch courses"}
        </p>
      )}

      {/* Display courses list */}
      {courses && courses.length === 0 ? (
        <p className="text-white text-center">No courses found.</p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {courses?.map((course) => (
            <div
              key={course?._id} // Use optional chaining in case _id is missing
              className="bg-white shadow-lg p-4 rounded-2xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{course?.title}</h2> {/* Use optional chaining */}
                <p className="text-sm text-gray-500">{course?.description}</p> {/* Use optional chaining */}
                <p className="text-sm text-gray-500">Category: {course?.category}</p> {/* Use optional chaining */}
                <p className="text-sm text-gray-500">Price: ${course?.price}</p> {/* Use optional chaining */}
                <p className="text-sm text-gray-500">
                  Instructor: {course?.instructorId?.username}
                </p>

                {/* Tags Section */}
                {course?.tags && course.tags.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-600 font-semibold">Tags:</span>
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* What You'll Learn Section */}
                {course?.whatYoullLearn && course.whatYoullLearn.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-600 font-semibold">What You'll Learn:</span>
                    {course.whatYoullLearn.map((item, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 rounded-full px-2 py-1 text-xs font-semibold text-blue-700 mr-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights Section */}
                {course?.highlights && course.highlights.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-600 font-semibold">Highlights:</span>
                    {course.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-100 rounded-full px-2 py-1 text-xs font-semibold text-green-700 mr-2"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/professional/${course?._id}/course`} // Use optional chaining
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                  aria-label={`View details for course ${course?.title}`} // Use optional chaining
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/professional/${course?._id}/module`} // Use optional chaining
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
                  aria-label={`View modules for course ${course?.title}`} // Use optional chaining
                  title="View Modules"
                >
                  <ModuleIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Button (Bottom Right) */}
      <Link
        to="/professional/create-course"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Create a New Course
      </Link>
    </div>
  );
};

export default MentorDashboard;