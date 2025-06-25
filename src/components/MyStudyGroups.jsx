import React, { useState } from "react";
import { Link } from "react-router-dom";

const MyStudyGroups = () => {
  const [activeButton, setActiveButton] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Study Groups</h1>
        <div className="flex flex-col gap-4">
          <Link to="/student/group-collaboration">
            <button
              className={`py-2 px-4 rounded-lg transition-all font-semibold ${
                activeButton === "collaboration" ? "bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => setActiveButton("collaboration")}
            >
              Group Collaboration
            </button>
          </Link>
          <Link to="/chat-messaging">
            <button
              className={`py-2 px-4 rounded-lg transition-all font-semibold ${
                activeButton === "chat" ? "bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={() => setActiveButton("chat")}
            >
              Chat & Messaging
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyStudyGroups;
