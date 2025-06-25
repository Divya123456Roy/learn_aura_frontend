import React, { useState } from "react";

const StudyGroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Study Group Chat</h1>
        
        <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="bg-purple-100 text-purple-900 rounded-lg p-2 inline-block">{msg.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupChat;
