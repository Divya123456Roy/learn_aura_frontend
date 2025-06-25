import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const MentorChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatRequested, setChatRequested] = useState(false);
  const [chatApproved, setChatApproved] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Function to request a chat and redirect
  const requestChat = () => {
    setChatRequested(true);
    navigate("/professional/mentorship-requests"); // ✅ Redirect after clicking "Request Chat"
  };

  // Function for mentor to approve the chat
  const approveChat = () => {
    setChatApproved(true);
  };

  // Function to send messages
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-green-200">
        <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">Mentor Chat</h1>

        {/* Chat Request Section */}
        {!chatRequested ? (
          <div className="text-center">
            <p className="text-green-700 mb-3">Request to chat with the mentor</p>
            <button
              onClick={requestChat} // ✅ Redirect on click
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Request Chat
            </button>
          </div>
        ) : !chatApproved ? (
          <div className="text-center">
            <p className="text-green-700 mb-3">Waiting for mentor approval...</p>
            <button
              onClick={approveChat} // Simulating mentor approval
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Mentor Approve
            </button>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto border border-green-300 rounded-lg p-3 bg-green-50">
              {messages.length === 0 ? (
                <p className="text-green-600 text-center">No messages yet. Start chatting!</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-semibold text-green-800">{msg.sender}</p>
                    <p
                      className={`rounded-lg p-2 inline-block ${
                        msg.sender === "You" ? "bg-green-300 text-gray-900" : "bg-green-200 text-gray-900"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border border-green-300 bg-green-50 text-green-800 rounded-lg"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorChat;
