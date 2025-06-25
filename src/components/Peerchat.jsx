import React, { useState } from "react";

const PeerChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Peer Chat</h1>
        
        <div className="h-64 overflow-y-auto border border-blue-300 rounded-lg p-3 bg-blue-50">
          {messages.length === 0 ? (
            <p className="text-blue-600 text-center">No messages yet. Start chatting!</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-semibold text-blue-800">{msg.sender}</p>
                <p className={`rounded-lg p-2 inline-block ${
                  msg.sender === "You" ? "bg-blue-300 text-gray-900" : "bg-blue-200 text-gray-900"
                }`}>
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-blue-300 bg-blue-50 text-blue-800 rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeerChat;
