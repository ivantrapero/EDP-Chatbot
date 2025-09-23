import React, { useState } from "react";
import "./App.css";

function DeveloperPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`devpage-container ${darkMode ? "dark" : ""}`}>
      <button className="darkmode-btn" onClick={toggleDarkMode}>
         {darkMode ? "☀️" : "🌖"}
      </button>

      <div className="profile-card">
        <img src="/ivan.jpg" alt="Developer" className="dev-image" />
        <h2 className="dev-name">Ivan Trapero</h2>
        <p className="dev-role">Intern Developer</p>
        <p className="dev-desc">
          Driven to build smart solutions and seamless digital experiences; creator of <b>AskBot</b>, helping students navigate EDP services.
        </p>
        <div className="dev-links">
          <a href="mailto:ivantrapero123@gmail.com" className="dev-btn">Email</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="dev-btn">GitHub</a>
          <a href="https://www.facebook.com/ivan.trapero.3" target="_blank" rel="noreferrer" className="dev-btn">Facebook</a>
        </div>
      </div>
    </div>
  );
}

export default DeveloperPage;
