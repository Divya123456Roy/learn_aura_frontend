import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Adding animations
import { FiUpload, FiDownload } from "react-icons/fi"; // ✅ Adding icons

const LearningResources = () => {
  const [resources, setResources] = useState([
    { id: 1, name: "📖 React Guide.pdf", url: "#" },
    { id: 2, name: "📊 Machine Learning Basics.ppt", url: "#" },
    { id: 3, name: "📝 JavaScript Notes.docx", url: "#" },
  ]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setResources([...resources, { id: resources.length + 1, name: `📂 ${uploadedFile.name}`, url: "#" }]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <motion.h2
        className="text-4xl font-extrabold mb-6 text-center text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📚 Learning Resources
      </motion.h2>

      {/* Upload Section */}
      <div className="mb-6 bg-white p-5 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-3">Upload Study Material</h3>
        <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center space-x-2">
          <FiUpload size={20} />
          <span>Choose File</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Resources List */}
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-3">📂 Available Resources</h3>
        <ul className="border p-3 h-48 overflow-y-auto bg-gray-100 rounded-lg space-y-2">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center">No resources available.</p>
          ) : (
            resources.map((resource) => (
              <motion.li
                key={resource.id}
                className="p-3 border-b bg-white rounded-md shadow-sm flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <span>{resource.name}</span>
                <a href={resource.url} download className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <FiDownload size={16} />
                  <span>Download</span>
                </a>
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
            to="/learning-resources"
            className="text-lg font-semibold text-blue-600 hover:underline transition-all hover:text-blue-800"
          >
            📚 Go to Learning Resources
          </Link>
        </nav>
        <Routes>
          <Route path="/learning-resources" element={<LearningResources />} />
        </Routes>
      </div>
    </Router>
  );
};

export default LearningResources;
