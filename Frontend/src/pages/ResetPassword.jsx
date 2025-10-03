import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./form.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "volunteer";
  const email = searchParams.get("email") || "";

  const [showResent, setShowResent] = useState(false);

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    // Go back to forgot password page
    navigate(`/forgot-password?role=${role}`);
  };

  return (
    <div className="reset-page">
      <button className="back-btn-top" onClick={handleBackToLogin}>
        <span className="back-arrow">←</span> Back to Login
      </button>

      <div className="reset-container">
        <div className="reset-icon">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="reset-title">Check Your Email</h1>
        <p className="reset-subtitle">
          We've sent password reset instructions to your email address.
        </p>

        <div className="reset-info-box">
          <p>
            If an account with that email exists, you'll receive reset instructions shortly.
          </p>
        </div>

        <button 
          type="button" 
          className="back-login-btn"
          onClick={handleBackToLogin}
        >
          Back to Login
        </button>

        <p className="resend-link">
          Didn't receive the email?{" "}
          <button 
            type="button" 
            className="try-again-link"
            onClick={handleTryAgain}
          >
            Try again
          </button>
        </p>
      </div>
    </div>
  );
}
