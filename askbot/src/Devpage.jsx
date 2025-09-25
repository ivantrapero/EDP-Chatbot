import React, { useState } from "react";
import "./App.css";

function DeveloperPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleFlip = () => setFlipped(!flipped);

  return (
    <div className={`devpage-background ${darkMode ? "dark" : ""}`}>
      <div className={`devpage-container ${darkMode ? "dark" : ""}`}>
        <button className="darkmode-btn" onClick={toggleDarkMode}>
          {darkMode ? "☀️" : "🌖"}
        </button>

        <div className={`profile-card ${flipped ? "flipped" : ""}`} onClick={toggleFlip}>
          {/* Front Side */}
          <div className="card-face card-front">
            <img src="/ivan.jpg" alt="Developer" className="dev-image" />
            <h2 className="dev-name">Ivan Trapero</h2>
            <p className="dev-role">Intern Developer</p>
            <p className="dev-desc">
              Driven to build smart solutions and seamless digital experiences; creator of{" "}
              <b>AskBot</b>, helping students navigate EDP services.
            </p>
          </div>

          {/* Back Side */}
          <div className="card-face card-back">
            <h3>Contact Me</h3>
            <div className="dev-links">
              <a href="mailto:ivantrapero123@gmail.com" className="dev-btn">Email</a>
              <a href="https://github.com/" target="_blank" rel="noreferrer" className="dev-btn">GitHub</a>
              <a href="https://www.facebook.com/ivan.trapero.3" target="_blank" rel="noreferrer" className="dev-btn">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperPage;
