import React from "react";
import MentorshipRequests from "../../components/MentorshipRequests"; // Ensure correct import path

const MentorshipPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <MentorshipRequests />
    </div>
  );
};

export default MentorshipPage;
