import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";
import "./form.css";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "volunteer";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Call backend API to send reset email
      const response = await API.post("/password/forgot", { email });

      if (response.data.success) {
        console.log("Reset password email sent for:", email);

        // Navigate to reset password confirmation (same component, different params)
        navigate(
          `/reset-password?role=${role}&email=${encodeURIComponent(email)}`
        );
      }
    } catch (err) {
      const errorMsg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to send reset email. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
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
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="forgot-title">Reset Your Password</h1>
          <p className="forgot-subtitle">
            Enter your {role === "ngo" ? "organization" : "account"} email
            address and we'll send you instructions to reset your password.
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

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

            <button
              type="submit"
              className={`reset-btn ${role}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
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