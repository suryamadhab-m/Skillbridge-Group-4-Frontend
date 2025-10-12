import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../utils/api";
import "./form.css";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "volunteer";
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");

  // If token exists, show password reset form
  // If email exists (no token), show confirmation message
  const isConfirmationPage = !token && email;
  const isResetPage = !!token;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isResetPage && !token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token, isResetPage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending password reset request...");
      console.log("Token:", token);
      console.log("Password length:", formData.password.length);

      const response = await API.post(`/password/reset`, {
        password: formData.password,
        token: token,
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate(`/login?role=${role}`);
        }, 3000);
      }
    } catch (err) {
      console.error("Reset error:", err);
      console.error("Response data:", err.response);
      const errorMsg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to reset password. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate(`/forgot-password?role=${role}`);
  };

  // SUCCESS STATE - Password reset successful
  if (success) {
    return (
      <div className="reset-page">
        <div className="reset-container">
          <div
            className="reset-icon"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 className="reset-title">Password Reset Successful!</h1>

          <div
            className="reset-info-box"
            style={{
              backgroundColor: "#d1fae5",
              border: "1px solid #10b981",
              color: "#065f46",
            }}
          >
            <p style={{ margin: 0 }}>
              ✅ Your password has been successfully reset!
            </p>
            <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
              Redirecting to login page...
            </p>
          </div>

          <button onClick={handleBackToLogin} className="back-login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // CONFIRMATION PAGE - Check your email
  if (isConfirmationPage) {
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
              If an account with that email exists, you'll receive reset
              instructions shortly.
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

  // RESET PASSWORD FORM - From email link
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

        <h1 className="reset-title">Create New Password</h1>
        <p className="reset-subtitle">Enter your new password below.</p>

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
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter new password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="back-login-btn"
            disabled={loading || !token}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>

          <p className="resend-link">
            Remember your password?{" "}
            <button
              type="button"
              className="try-again-link"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
