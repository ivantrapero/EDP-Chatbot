import React, { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Array of taglines
  const taglines = [
    "Dili mosuko, pero mutubag.",
    "Way uyab, mao nga ikaw akong tubagon.",
    "Mas responsive pa kaysa sa imong crush.",
    "Kasabaon, pero kasaligan.",
    "Kung wa kay kasabot, ako’y imong kasabot.",
    "Mangyawyaw lang, pero mutudlo gihapon.",
    "Dili ko maluya, bisag imong wifi hinay.",
    "Ang imong pangutana, akong daily vitamins.",
    "Murag maestro nga walay chalk—pero daghan tubag.",
    "Ang chatbot nga dili mu-ghost."
  ];


 // Change tagline every 7 seconds with fade effect
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setFade(true);
      }, 500); 
    }, 7000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  const handleGetStarted = () => {
    navigate("/login");
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
        <div className="main-title">BagutBOT</div>
        <div className="logo-text">
          <i className={fade ? "fade-in" : "fade-out"}>{taglines[taglineIndex]}</i>
          <br /><br /><br />
          ( Your friendly assistant for UC Banilad EDP Department queries )
        </div>
        <button
          className="start-chat-btn"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
        <footer className="home-footer">
          © {new Date().getFullYear()} BagutBOT | Developed by Ivan Trapero
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
