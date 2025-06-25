import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data directly in the component file
const assignments = [
  {
    _id: "assign1",
    title: "Python Syntax Exercise",
    description: "Complete basic Python syntax exercises",
    dueDate: "2024-03-15T23:59:00Z",
    courseId: { _id: "course1", name: "Intro to CS" },
    moduleId: { _id: "module1", name: "Programming Basics" },
    submissions: [{ studentId: "student123", grade: "A" }]
  },
  {
    _id: "assign2",
    title: "Web Development Project",
    description: "Build a responsive website using HTML/CSS",
    dueDate: "2024-03-20T23:59:00Z",
    courseId: { _id: "course2", name: "Web Fundamentals" },
    moduleId: { _id: "module3", name: "HTML/CSS Basics" },
    submissions: []
  }
];

const StudentAllAssignments = ({ user }) => {
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  useEffect(() => {
    if (!user) {
      console.error("User is undefined");
      return;
    }

    try {
      const enrolledCourses = user.enrolledCourses || []; // Ensure enrolledCourses exists
      const enrolledAssignments = assignments.filter(assignment =>
        enrolledCourses.includes(assignment.courseId._id)
      );
      setFilteredAssignments(enrolledAssignments);
    } catch (error) {
      console.error("Error filtering assignments:", error);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Assignments</h1>
      <div className="grid gap-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{assignment.title}</h2>
                  <p className="text-gray-600 mt-2">{assignment.description}</p>
                  <div className="mt-2 text-sm space-y-1">
                    <p className="text-gray-500">
                      <span className="font-medium">Course:</span> {assignment.courseId.name}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Module:</span> {assignment.moduleId.name}
                    </p>
                    <p className="text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {assignment.submissions.some(sub => sub.studentId === user?._id) && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Graded
                  </span>
                )}
              </div>
              <Link
                to={`/assignments/${assignment._id}`}
                className="mt-3 inline-block text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAllAssignments;
