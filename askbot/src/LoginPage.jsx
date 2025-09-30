import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "./App.css";

function LoginPage() {
  const [idNumber, setIdNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const getEmail = (id) => `${id}@ucb.edu.ph`;
  const getPassword = (id) => id; // auto password = ID Number

  // LOGIN: ID Number only
  const handleLogin = async () => {
  if (!idNumber) {
    alert("Please enter your UC Banilad ID Number.");
    return;
  }

  const idTrimmed = idNumber.trim();

  if (!/^\d+$/.test(idTrimmed)) {
    alert("ID Number must contain only digits.");
    return;
  }

  const email = getEmail(idTrimmed);
  const password = getPassword(idTrimmed);

  try {
    // Must be inside async function
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    localStorage.setItem("userId", uid);
    navigate("/chat");
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Make sure you are registered.");
  }
};

  // REGISTER: ID Number + Last Name
  const handleRegister = async () => {
    if (!idNumber || !lastName) {
      alert("Please enter both ID Number and Last Name.");
      return;
    }

    const email = getEmail(idNumber);
    const password = getPassword(idNumber);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Save user info in Firestore using UID as document ID
      await setDoc(doc(db, "users", uid), {
        idNumber,
        lastName,
        promptsUsed: 0,
        lastLoginDate: new Date().toDateString(),
      });

      setSuccessMessage("Registration successful! You can now login.");
      setIdNumber("");
      setLastName("");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed: " + err.message);
    }
  };

  const openRegister = () => {
    setIdNumber("");
    setLastName("");
    setSuccessMessage("");
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
    setIdNumber("");
    setLastName("");
    setSuccessMessage("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Welcome to</h3>
        <h1>BagutBOT</h1>
        <p>Log in with your ID</p>

        <div className="input-label">
        <input type="text" 
        name="text" className="input" 
        pattern="\d+" value={idNumber} onChange={(e) =>
        setIdNumber(e.target.value)} 
        placeholder="ID Number" /> </div>
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <span className="register-text" onClick={openRegister}>
          Register
        </span>

       {showRegister && (
  <div className="modal-overlay">
    <div className="register-card">
      {successMessage ? (
        <div className="success-card">
          <p>{successMessage}</p>
          <button onClick={closeRegister} className="submit-btn">
            OK
          </button>
        </div>
      ) : (
        <>
          <h3>Register</h3>
          <input
            type="text"
            className="input-field"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="ID Number"
          />
          <input
            type="text"
            className="input-field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <button onClick={handleRegister} className="submit-btn">
            Submit
          </button>
          <button onClick={closeRegister} className="cancel-btn">
            Cancel
          </button>
        </>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
}
export default LoginPage;