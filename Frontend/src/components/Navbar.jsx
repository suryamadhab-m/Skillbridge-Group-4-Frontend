import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AuthProvider } from "../context/AuthProvider";
import "./components.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Scroll to CTA section
  const scrollToCTA = () => {
    const ctaSection = document.getElementById("cta");
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sb-navbar">
      <div className="container sb-navbar-inner">
        <Link to="/" className="sb-logo">
          <div className="sb-logo-mark">S</div>
          <span className="sb-logo-text">SkillBridge</span>
        </Link>

        <nav className="sb-nav-actions" aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              {/* Show user info when logged in */}
              <span
                style={{
                  marginRight: "15px",
                  color: "#333",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    backgroundColor:
                      user && user.role === "volunteer" ? "#10b981" : "#3b82f6",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  {user && user.role}
                </span>
                Welcome, <strong>{user && user.name}</strong>
              </span>
              <Link
                to="/create-profile"
                className="btn btn-secondary"
                style={{ marginRight: "10px" }}
              >
                Profile
              </Link>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Sign Up button when not logged in */}
              <button className="btn btn-primary" onClick={scrollToCTA}>
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}