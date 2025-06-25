import React, { useState } from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 max-w-sm">
      <img
        src={course.courseImage || "https://via.placeholder.com/300"}
        alt={course.title}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h2 className="text-xl font-bold mt-3">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.description}</p>
      <p className="text-blue-500 font-semibold mt-2">Enrollment Count: {course.enrollmentCount}</p>
      <p className="text-sm text-gray-500">Category: {course.category}</p>
      <h3 className="text-lg font-semibold mt-3">Modules:</h3>
      <ul className="list-disc list-inside text-gray-700">
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((module, index) => <li key={index}>{module}</li>)
        ) : (
          <li>No modules available</li>
        )}
      </ul>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Enroll Now
      </button>
    </div>
  );
};

const CourseList = () => {
  const courses = [
    {
      _id: "1",
      title: "React for Beginners",
      description: "Learn React from scratch",
      courseImage: "https://via.placeholder.com/300",
      enrollmentCount: 120,
      category: "Web Development",
      modules: ["Introduction", "Components", "State & Props", "Hooks"],
    },
    {
      _id: "2",
      title: "Advanced JavaScript",
      description: "Master JavaScript concepts",
      courseImage: "https://via.placeholder.com/300",
      enrollmentCount: 200,
      category: "Programming",
      modules: ["Closures", "Async/Await", "Prototypes", "ES6+"],
    },
  ];

  return (
    <div className="container mx-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;