import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook, FaSignInAlt } from "react-icons/fa";

// Static group data
const allGroups = {
  1: {
    name: "C++ Study Group",
    members: 10,
    description: "Join the C++ enthusiasts and master competitive programming.",
    discussions: [
      { user: "Alice", message: "What are pointers in C++?" },
      { user: "Bob", message: "Can someone explain recursion with an example?" }
    ],
    resources: [
      { title: "C++ Basics", link: "https://www.learncpp.com" },
      { title: "STL Guide", link: "https://cplusplus.com/reference/stl" }
    ],
    assignments: [
      { title: "Implement a Linked List", description: "Write a C++ program to implement a linked list." }
    ],
    liveSessions: {
      time: "Every Friday at 6 PM",
      link: "https://meet.google.com/abc-cpp-live"
    }
  },
  2: {
    name: "Java Study Group",
    members: 8,
    description: "Learn Java together, from basics to advanced topics.",
    discussions: [
      { user: "David", message: "How does garbage collection work in Java?" },
      { user: "Eve", message: "What are the best practices for Java OOP?" }
    ],
    resources: [
      { title: "Java Basics", link: "https://www.javatpoint.com" },
      { title: "Spring Boot Tutorial", link: "https://spring.io/guides" }
    ],
    assignments: [
      { title: "Create a Banking System", description: "Write a Java program simulating bank account transactions." }
    ],
    liveSessions: {
      time: "Every Wednesday at 7 PM",
      link: "https://meet.google.com/xyz-java-live"
    }
  },
  3: {
    name: "Python Study Group",
    members: 15,
    description: "Master Python programming with hands-on projects.",
    discussions: [
      { user: "Frank", message: "What is the difference between a list and a tuple?" },
      { user: "Grace", message: "How does Python manage memory?" }
    ],
    resources: [
      { title: "Python Basics", link: "https://www.python.org/doc" },
      { title: "Django Tutorial", link: "https://www.djangoproject.com/start/" }
    ],
    assignments: [
      { title: "Build a To-Do App", description: "Use Python and Flask to create a simple to-do list." }
    ],
    liveSessions: {
      time: "Every Monday at 5 PM",
      link: "https://meet.google.com/def-python-live"
    }
  }
};

const GroupPage = () => {
  const { groupId } = useParams();
  const group = allGroups[groupId] || { name: "Unknown Group", members: 0, description: "No details available" };
  const [activeTab, setActiveTab] = useState("resources"); // Default to resources
  const navigate = useNavigate();

  // Handle Join Group Click
  const handleJoinGroup = () => {
    navigate("/student/chat-messaging"); // Redirect to chat-messaging page
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center">{group.name}</h1>
      <p className="text-center text-gray-600">{group.description}</p>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-6 bg-white p-3 rounded-lg shadow-md mt-4">
        <button
          className={`p-2 font-semibold ${activeTab === "resources" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("resources")}
        >
          <FaBook className="inline mr-2" /> Resources
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
        {activeTab === "resources" && (
          <div>
            <h2 className="text-xl font-semibold">Study Resources</h2>
            <ul className="mt-2">
              {group.resources?.map((resource, index) => (
                <li key={index} className="p-2 border-b">
                  <a href={resource.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>

            {/* Join Group Button under Resources */}
            <button
              onClick={handleJoinGroup}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaSignInAlt className="mr-2" /> Join Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;