

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiStar, FiTrendingUp } from "react-icons/fi";

export default function Gamification() {
  // Sample leaderboard data
  const leaderboard = [
    { id: 1, name: "Alice", points: 1500, rank: 1 },
    { id: 2, name: "Bob", points: 1200, rank: 2 },
    { id: 3, name: "Charlie", points: 1000, rank: 3 },
  ];

  // User's progress & achievements
  const [user, setUser] = useState({
    name: "You",
    points: 900,
    progress: 70, // percentage
    badges: ["Beginner", "Fast Learner", "Consistent"],
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🎮 Gamification Dashboard
        </h2>

        {/* User Progress Section */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold flex items-center space-x-2 text-blue-600">
            <FiTrendingUp size={24} />
            <span>Your Progress</span>
          </h3>
          <p className="text-gray-600">Points: {user.points}</p>
          <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
            <motion.div
              className="bg-blue-500 h-4 rounded-full text-center text-xs text-white font-bold"
              style={{ width: `${user.progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${user.progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {user.progress}%
            </motion.div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold flex items-center space-x-2 text-green-600">
            <FiAward size={24} />
            <span>Your Achievements</span>
          </h3>
          <div className="flex flex-wrap mt-2">
            {user.badges.map((badge, index) => (
              <motion.div
                key={index}
                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full m-1 text-sm font-semibold shadow"
                whileHover={{ scale: 1.1 }}
              >
                🏅 {badge}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold flex items-center space-x-2 text-yellow-600">
            <FiStar size={24} />
            <span>Leaderboard</span>
          </h3>
          <table className="w-full mt-3">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Rank</th>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <motion.tr
                  key={player.id}
                  className="border-b hover:bg-gray-200 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <td className="py-2 text-blue-600 font-bold">#{player.rank}</td>
                  <td className="py-2">{player.name}</td>
                  <td className="py-2 text-gray-700">{player.points} pts</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}


