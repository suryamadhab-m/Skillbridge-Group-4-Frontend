import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./form.css";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const role = searchParams.get("role") || "volunteer";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      console.log("Login successful:", result.user);

      if (result.user.role !== role) {
        setError(
          `This account is registered as ${result.user.role}. Please use the correct login page.`
        );
        return;
      }

      // Redirect based on role
      if (result.user.role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (result.user.role === "ngo") {
        navigate("/ngo-dashboard");
      }
    } else {
      const errorMsg = result.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
    }
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
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h1 className="login-title">Login as Volunteer</h1>
          <p className="login-subtitle">
            Welcome back! Please sign in to your account.
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

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
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

            <button
              type="submit"
              className="login-btn volunteer-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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
              <a href="/register?role=volunteer">
                Create an account as Volunteer
              </a>
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
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="login-title">Login as NGO</h1>
        <p className="login-subtitle">
          Welcome back! Please sign in to your organization account.
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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your organization email"
              value={formData.email}
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

          <button
            type="submit"
            className="login-btn ngo-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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