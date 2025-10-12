import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "/src/context/AuthProvider.jsx";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import EditProfile from "./pages/EditProfile";


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes with Navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <Landing />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <Register />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <Navbar />
            <ForgotPassword />
          </>
        } />
        <Route path="/reset-password" element={
          <>
            <Navbar />
            <ResetPassword />
          </>
        } />
        
        {/* Dashboard routes (no separate Navbar as it has its own header) */}
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />

      </Routes>
    </AuthProvider>
  );
}
