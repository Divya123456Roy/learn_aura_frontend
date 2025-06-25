import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Adding animation effects

const ProgressTracking = () => {
  const [progress, setProgress] = useState(70); // Progress in %
  const [achievements, setAchievements] = useState([
    "🎯 Completed JavaScript Basics",
    "🏅 Earned React Beginner Badge",
    "🚀 Submitted First Project",
  ]);

  return (
    <div className="container mx-auto p-6">
      <motion.h2 
        className="text-4xl font-extrabold mb-6 text-center text-blue-600"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📊 Progress Tracking
      </motion.h2>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        {/* Progress Bar */}
        <h3 className="text-xl font-semibold mb-2">Overall Progress</h3>
        <div className="w-full bg-gray-300 rounded-full h-6 mb-4 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full text-white text-center text-sm shadow-lg"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {progress}%
          </motion.div>
        </div>

        {/* Achievements Section */}
        <h3 className="text-xl font-semibold mt-4 mb-2">🏆 Achievements</h3>
        <ul className="border p-3 rounded-lg bg-gray-100 space-y-2">
          {achievements.length === 0 ? (
            <p className="text-gray-500">No achievements yet.</p>
          ) : (
            achievements.map((achievement, index) => (
              <motion.li
                key={index}
                className="p-3 border-b bg-white rounded-md shadow-sm flex items-center space-x-2 cursor-pointer hover:bg-blue-50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                {achievement}
              </motion.li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="p-6">
        <nav className="mb-4 text-center">
          <Link 
            to="/progress-tracking" 
            className="text-lg font-semibold text-blue-600 hover:underline transition-all hover:text-blue-800"
          >
            📊 Go to Progress Tracking
          </Link>
        </nav>
        <Routes>
          <Route path="/progress-tracking" element={<ProgressTracking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default ProgressTracking;
