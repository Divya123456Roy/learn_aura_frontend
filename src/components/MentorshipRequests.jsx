import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Check, X } from "lucide-react";

const mentorshipRequests = [
  { id: 1, name: "John Doe", message: "I would love to have you as a mentor." },
  { id: 2, name: "Jane Smith", message: "Looking forward to learning from you!" },
  { id: 3, name: "Alex Johnson", message: "Can you guide me in web development?" },
];

export default function MentorshipRequests() {
  const [requests, setRequests] = useState(mentorshipRequests);
  const navigate = useNavigate();

  const handleAction = (id, action) => {
    const student = requests.find((req) => req.id === id);

    if (action === "accept" && student) {
      // Remove from request list
      setRequests(requests.filter((req) => req.id !== id));

      // ✅ Redirect to the chat page immediately after accepting
      navigate(`/mentor/chat/${id}`, { state: { student } });
    } else if (action === "reject") {
      setRequests(requests.filter((req) => req.id !== id));
    } else if (action === "chat") {
      alert("Chat is only available after accepting a request.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Mentorship Requests</h2>

      <div className="space-y-6">
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center">No mentorship requests available.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-5 bg-white shadow-md rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{request.name}</h3>
              <p className="text-gray-700 mb-4 italic">"{request.message}"</p>
              <div className="flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  onClick={() => handleAction(request.id, "accept")}
                >
                  <Check className="w-5 h-5 inline mr-2" /> Accept & Chat
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  onClick={() => handleAction(request.id, "reject")}
                >
                  <X className="w-5 h-5 inline mr-2" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
