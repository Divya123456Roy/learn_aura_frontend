import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AssignmentsByCourse = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);

  console.log(courseId);
  

  useEffect(() => {
    const fetchAssignments = async () => {
      const response = await fetch(`/api/assignments/course/${courseId}`);
      const data = await response.json();
      setAssignments(data);
    };
    fetchAssignments();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assignments for Course {courseId}</h1>
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{assignment.title}</h2>
            <p className="text-gray-600">{assignment.description}</p>
            <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsByCourse;