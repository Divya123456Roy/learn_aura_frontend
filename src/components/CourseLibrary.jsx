import React from "react";
import { useNavigate } from "react-router-dom";

const CourseLibrary = () => {
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className="p-6 bg-gray-100 w-full min-h-screen">
      <h1 className="text-3xl font-bold w-full text-center mb-6">Course Library</h1>

      <div className="grid md:grid-cols-1 gap-6">
        {/* Browse Courses Card */}
        <div className="bg-white w-full shadow-lg p-4 rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-500 text-4xl">📖</div>
            <h2 className="text-xl font-semibold">Browse Courses</h2>
            <p className="text-gray-600 text-center">
              Explore structured learning paths tailored to your goals.
            </p>
            <button 
              onClick={() => navigate("/student/browse-course")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLibrary;
