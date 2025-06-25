import React from 'react'

import { Link } from 'react-router-dom';
import { FaList, FaBook, FaLayerGroup } from 'react-icons/fa';

const StudentAssignment = ({ user }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-black"
      style={{ backgroundImage: "url('/public/classroom.jpg')" }} // Replace with an appropriate image
    >
      {/* Navbar
      <nav className="bg-black bg-opacity-80 px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">Student Dashboard</h1>
        <div className="space-x-6 text-lg">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav> */}

      {/* Dashboard Content */}
      <div className="p-10 backdrop-blur-md bg-white bg-opacity-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-10 text-center">My Assignments</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* View All Assignments */}
          <Link
            to="/student/view-assignments"
            className="bg-purple-600 p-6 rounded-xl shadow-lg hover:bg-purple-700 transition flex items-center gap-4"
          >
            <FaList size={30} /> <span className="text-xl font-semibold">View All Assignments</span>
          </Link>

          {/* Assignments by Course */}
          <Link
            to="/student/stud-assign-course" // Replace :courseId with a dynamic value in practice
            className="bg-green-600 p-6 rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-4"
          >
            <FaBook size={30} /> <span className="text-xl font-semibold">Assignments by Course</span>
          </Link>

          {/* Assignments by Module */}
          <Link
            to="/student/stud-assign-module" // Replace :moduleId with a dynamic value in practice
            className="bg-pink-600 p-6 rounded-xl shadow-lg hover:bg-pink-700 transition flex items-center gap-4"
          >
            <FaLayerGroup size={30} /> <span className="text-xl font-semibold">Assignments by Module</span>
          </Link>
        </div>
      </div>
    </div>
  );
};



export default StudentAssignment