import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";

export default function App() {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-profile" element={<CreateProfile />} />
      </Routes>

    </div>
  );
}
