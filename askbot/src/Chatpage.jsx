import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./App.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [choices, setChoices] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [promptsUsed, setPromptsUsed] = useState(0);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must log in first.");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.promptsUsed >= 5) {
          setMessages([...messages, { text: "⚠️ You have reached your daily 5-prompt limit.", sender: "bot" }]);
          return;
        }

        await updateDoc(userRef, {
          promptsUsed: userData.promptsUsed + 1,
        });

        setPromptsUsed(userData.promptsUsed + 1);
      }
    } catch (err) {
      console.error("Error checking prompt limit:", err);
      return;
    }

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setChoices([]);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { message });
      setMessages([...newMessages, { text: res.data.response, sender: "bot" }]);
      if (res.data.choices?.length > 0) setChoices(res.data.choices);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages([...newMessages, { text: "Unable to reach BagutBOT. Try again later.", sender: "bot" }]);
    }
  };

  const toggleExpand = (index) => {
    setExpandedMessages((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderBotMessage = (msg, index) => {
    const isExpanded = expandedMessages[index];
    const maxLength = 300;

    if (!isExpanded && msg.text.length > maxLength) {
      return (
        <div onClick={() => toggleExpand(index)} style={{ cursor: "pointer" }}>
          {msg.text.substring(0, maxLength)}...
          <span style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
            {" "} (click to expand)
          </span>
        </div>
      );
    }

    const lines = msg.text.split(/\n/).map((line) => line.trim()).filter(Boolean);
    return lines.map((line, i) =>
      /^\d+\./.test(line) ? (
        <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>
      ) : (
        <div key={i}>{line}</div>
      )
    );
  };

  return (
    <div className="chatpage-container">
      <div className="chatpage-title">
        <h2>BagutBOT</h2>
        <p>Prompts Used: {promptsUsed}/5</p>
      </div>

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
        <div ref={chatEndRef} />
      </div>

      {choices.length > 0 && (
        <div className="choices-container">
          {choices.map((choice, index) => (
            <button key={index} className="choice-button" onClick={() => handleSend(choice)}>
              {choice}
            </button>
          ))}
        </div>
      )}

      <div className="input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-button" onClick={() => handleSend()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
