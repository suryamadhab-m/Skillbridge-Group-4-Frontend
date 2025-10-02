/*import React from "react";

export default function Login() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
    </div>
  );
}*/
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./form.css";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "volunteer";

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { ...formData, role });
    // Add your API call here
  };

  const handleBackToHome = () => {
    navigate("/");
  };

 const handleForgotPassword = () => {
  navigate(`/forgot-password?role=${role}`);
};


  if (role === "volunteer") {
    return (
      <div className="login-page">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span> Back to Home
        </button>

        <div className="login-container">
          <div className="login-icon volunteer-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h1 className="login-title">Login as Volunteer</h1>
          <p className="login-subtitle">Welcome back! Please sign in to your account.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="login-btn volunteer-btn">
              Login
            </button>

            <button 
              type="button" 
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>

            <p className="signup-link">
              Don't have an account?{" "}
              <a href="/register?role=volunteer">Create an account as Volunteer</a>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // NGO Login Form
  return (
    <div className="login-page">
      <button className="back-btn" onClick={handleBackToHome}>
        <span className="back-arrow">←</span> Back to Home
      </button>

      <div className="login-container">
        <div className="login-icon ngo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="login-title">Login as NGO</h1>
        <p className="login-subtitle">Welcome back! Please sign in to your organization account.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="login-btn ngo-btn">
            Login
          </button>

          <button 
            type="button" 
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>

          <p className="signup-link">
            Don't have an account?{" "}
            <a href="/register?role=ngo">Create an account for NGO</a>
          </p>
        </form>
      </div>
    </div>
  );
}
