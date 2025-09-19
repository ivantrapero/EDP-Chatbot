import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./Chatpage";
import Devpage from "./Devpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/developer" element={<Devpage />} />
    </Routes>
  );
}

export default App;