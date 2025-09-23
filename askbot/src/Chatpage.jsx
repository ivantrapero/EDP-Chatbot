import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [choices, setChoices] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});

  // Ref for auto-scrolling
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch welcome message
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await axios.post("http://127.0.0.1:5000/chat", { start: true });
        setMessages([{ text: res.data.response, sender: "bot" }]);
        if (res.data.choices?.length > 0) setChoices(res.data.choices);
      } catch (error) {
        console.error("Error fetching welcome message:", error);
      }
    };
    fetchWelcome();
  }, []);

  const handleSend = async (message = input) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setChoices([]);

    try {
      // Send message to backend
      const res = await axios.post("http://127.0.0.1:5000/chat", { message });
      setMessages([...newMessages, { text: res.data.response, sender: "bot" }]);
      if (res.data.choices?.length > 0) setChoices(res.data.choices);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages([...newMessages, { text: "Unable to reach AskBot. Try again later.", sender: "bot" }]);
    }
  };

  const toggleExpand = (index) => {
    setExpandedMessages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderBotMessage = (msg, index) => {
    const isExpanded = expandedMessages[index];
    const maxLength = 300;

    if (!isExpanded && msg.text.length > maxLength) {
      return (
        <div onClick={() => toggleExpand(index)} style={{ cursor: "pointer" }}>
          {msg.text.substring(0, maxLength)}...
          <span style={{ fontStyle: "italic", fontSize: "0.8rem" }}> (click to expand)</span>
        </div>
      );
    }

    const lines = msg.text.split(/\n/).map(line => line.trim()).filter(Boolean);

    return lines.map((line, i) => {
      if (/^\d+\./.test(line)) {
        return <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>;
      }
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <div className="chatpage-container">
      <div className="chatpage-title"><h2>ASKBOT</h2></div>

      {/* Chat messages */}
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user" : "bot"}`}>
            {msg.sender === "bot" ? (
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                {renderBotMessage(msg, index)}
              </ul>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {/* Dummy div for auto-scrolling */}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested choices */}
      {choices.length > 0 && (
        <div className="choices-container">
          {choices.map((choice, index) => (
            <button key={index} className="choice-button" onClick={() => handleSend(choice)}>
              {choice}
            </button>
          ))}
        </div>
      )}

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
        <button className="send-button" onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
