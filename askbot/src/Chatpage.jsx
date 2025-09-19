import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // handle sending message
  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message first
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);

    try {
      // Send request to Flask backend
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
      });

      // Add bot response
      setMessages([
        ...newMessages,
        { text: res.data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages([
        ...newMessages,
        { text: "Unable to reach AskBot. Try again later.", sender: "bot" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatpage-container">
      <div className="chatpage-title">
        <h2>ASKBOT</h2>
      </div>

      {/* Chat messages */}
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
