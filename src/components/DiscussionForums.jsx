import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


const discussions = [
  { id: 1, title: "Best Practices for React Development", author: "John Doe", replies: 5 },
  { id: 2, title: "How AI is Changing the Industry", author: "Jane Smith", replies: 8 },
  { id: 3, title: "Understanding Backend Frameworks", author: "Alex Johnson", replies: 3 },
];

export default function DiscussionForums() {
  const [forumTopics, setForumTopics] = useState(discussions);
  const [notifications, setNotifications] = useState([]);

  const handleNewQuestion = (topic) => {
    setNotifications((prev) => [...prev, topic]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Discussion Forums</h2>
        <Link to="/professional/notification" className="relative px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg font-semibold transition duration-300">
          <Bell className="w-6 h-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </Link>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <Link to="/answer-questions" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105">
          Answer Questions
        </Link>
        <Link to="/industry-topics" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105">
          Engage with Industry Topics
        </Link>
      </div>
      <div className="space-y-6">
        {forumTopics.map((topic) => (
          <div key={topic.id} className="p-5 bg-white shadow-md rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{topic.title}</h3>
            <p className="text-gray-600">By {topic.author} | {topic.replies} Replies</p>
            <div className="mt-3 flex justify-between">
              <Link to={`/forum/${topic.id}`} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition">
                Join Discussion
              </Link>
              <button onClick={() => handleNewQuestion(topic.title)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">
                Notify Me
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
