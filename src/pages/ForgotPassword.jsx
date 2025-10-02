import React, { useState } from "react";
import { useNavigate, useSearchParams,Link } from "react-router-dom";
import "./form.css";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "volunteer"; 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password requested for:", role, email);
    // Call API here to send reset link
  };

  const handleBackToLogin = () => {
    navigate(`/login?role=${role}`);
  };

  return (
  <div className="forgot-page">
    {/* Back button placed inside container, below navbar */}
    <div className="forgot-container-wrapper">
      <button className="back-btn" onClick={handleBackToLogin}>
        ← Back to Login
      </button>

      <div className={`forgot-container ${role}`}>
        <div className="forgot-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 17v.01M12 12a5 5 0 0 1 10 0v5H2v-5a5 5 0 0 1 10 0z" />
          </svg>
        </div>

        <h1 className="forgot-title">Reset Your Password</h1>
        <p className="forgot-subtitle">
          Enter your {role === "ngo" ? "organization" : "account"} email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`reset-btn ${role}`}>
            Send Reset Instructions
          </button>

          <p className="remember-password">
            Remember your password?{" "}
            <Link to={`/login?role=${role}`}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  </div>
);

}
