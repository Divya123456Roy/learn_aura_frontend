import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiPlusCircle, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StudyGroups = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: "C++", members: 10, joined: false },
    { id: 2, name: "Java", members: 8, joined: false },
    { id: 3, name: "Python", members: 15, joined: false },
  ]);

  const navigate = useNavigate();

  const handleJoinGroup = (id) => {
    setGroups(
      groups.map((group) =>
        group.id === id ? { ...group, members: group.members + 1, joined: true } : group
      )
    );
    navigate(`/student/group-page/${id}`); // Redirect to individual group page
  };

  return (
    <div className="container mx-auto p-6">
      <motion.h2
        className="text-4xl font-extrabold mb-2 text-center text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📚 Study Groups
      </motion.h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            className="bg-white p-5 rounded-lg shadow-lg text-center border border-gray-200 transition-all hover:shadow-xl"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-xl font-semibold flex items-center justify-center space-x-2">
              <FiUsers size={20} /> <span>{group.name}</span>
            </h3>
            <p className="text-gray-600 mt-2">👥 Members: {group.members}</p>
            {group.joined ? (
              <motion.button
                className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                disabled
              >
                <FiCheck className="mr-1" /> Joined
              </motion.button>
            ) : (
              <motion.button
                onClick={() => handleJoinGroup(group.id)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                Join Group
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroups;
