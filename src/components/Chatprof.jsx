import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const chats = [
  { id: 1, name: "John Doe", type: "Student", message: "Hello! I need help with React." },
  { id: 2, name: "Jane Smith", type: "Student", message: "Let's discuss the latest AI trends." },
  { id: 3, name: "Alex Johnson", type: "Student", message: "Can you guide me on backend development?" },
];

export default function ChatProf() {
  const [chatList, setChatList] = useState(chats);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Chat & Messaging</h2>
      <div className="space-y-6">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className="p-5 bg-white shadow-md rounded-lg border border-gray-200 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{chat.name}</h3>
              <p className="text-gray-700 italic">"{chat.message}"</p>
            </div>
            <Link
              to="/student/mentor-chat"
              className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition duration-300 transform hover:scale-105 ${
                chat.type === "Student" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {chat.type}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
