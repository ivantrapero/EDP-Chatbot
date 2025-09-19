import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate("/chat");
  };

  const handleDeveloperClick = () => {
    navigate("/developer");
  };

  return (
    <div className="developer-container">
      <button className="developer-btn" onClick={handleDeveloperClick}>
        Developer
      </button>

    <div className="center-content">
      <div className="main-title">ASKBOT</div>
      <div className="logo-text">
        Your friendly assistant for <br />UC Banilad EDP Department queries
      </div>
      <button
        className="start-chat-btn"
        type="button"
        aria-label="Start Chat"
        onClick={handleStartChat}
      >
        Start Chat
      </button>
        <footer className="home-footer" role="contentinfo">
          © {new Date().getFullYear()} AskBot | Developed by Ivan Trapero
        </footer>
      </div>
      </div>
  );
}

export default HomePage;