import React from 'react'

import { Link, useParams } from 'react-router-dom';
import { FaPlus, FaList, FaBook, FaLayerGroup, FaPen } from 'react-icons/fa';

const AssignmentForm = ({ user }) => {

  const {moduleId,courseId} = useParams()
  
  return (
    <div
      className="min-h-screen bg-cover bg-center text-black"
      style={{ backgroundImage: "url('/public/classroom.jpg')" }} // Replace with an appropriate image
    >
      

      {/* Dashboard Content */}
      <div className="p-10 backdrop-blur-md bg-white bg-opacity-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-10 text-center">Assignment Manager</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Create Assignment */}
          <Link
           to={`/professional/${courseId}/${moduleId}/assignment/create-assignment`}
            className="bg-blue-600 p-6 rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center gap-4"
          >
            {/* console.log(courseId, moduleId); */}

            <FaPlus size={30} /> <span className="text-xl font-semibold">Create Assignment</span>
          </Link>

          {/* View All Assignments */}
          <Link
            to={`/professional/${courseId}/${moduleId}/assignment/view-assignment`}
            className="bg-purple-600 p-6 rounded-xl shadow-lg hover:bg-purple-700 transition flex items-center gap-4"
          >
            <FaList size={30} /> <span className="text-xl font-semibold">View All Assignments</span>
          </Link>

          {/* Assignments by Course */}
          <Link
            to="/professional/assign-by-course" // Replace :courseId with a dynamic value in practice
            className="bg-green-600 p-6 rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-4"
          >
            <FaBook size={30} /> <span className="text-xl font-semibold">Assignments by Course</span>
          </Link>

          {/* Assignments by Module */}
          <Link
            to="/professional/assign-by-module" // Replace :moduleId with a dynamic value in practice
            className="bg-pink-600 p-6 rounded-xl shadow-lg hover:bg-pink-700 transition flex items-center gap-4"
          >
            <FaLayerGroup size={30} /> <span className="text-xl font-semibold">Assignments by Module</span>
          </Link>

          {/* Grade Assignment */}
          <Link
            to="/professional/grade-assign" // Replace :id with a dynamic value in practice
            className="bg-yellow-600 p-6 rounded-xl shadow-lg hover:bg-yellow-700 transition flex items-center gap-4"
          >
            <FaPen size={30} /> <span className="text-xl font-semibold">Grade Assignments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};



export default AssignmentForm;