import React from "react";
import { Link } from "react-router-dom";
import "./components.css"; 

export default function Navbar() {
  // Scroll to CTA section
  const scrollToCTA = () => {
    const ctaSection = document.getElementById("cta");
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sb-navbar">
      <div className="container sb-navbar-inner">
        <Link to="/" className="sb-logo">
          <div className="sb-logo-mark">S</div>
          <span className="sb-logo-text">SkillBridge</span>
        </Link>

        <nav className="sb-nav-actions" aria-label="Main navigation">
          {/* Single Sign Up button */}
          <button className="btn btn-primary" onClick={scrollToCTA}>
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
}
