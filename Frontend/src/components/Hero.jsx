import React from "react";
import "./components.css";

export default function Hero() {
  return (
    <section className="sb-hero">
      <div className="container sb-hero-inner">
        <div className="sb-hero-text">
          <h1>
            Connecting Skilled Volunteers with Meaningful Opportunities
          </h1>
          <p>
            SkillBridge is the premier platform that matches talented volunteers with NGOs and nonprofits that need their expertise. 
            Make a difference while developing your skills and expanding your network.
          </p>
          <div className="hero-buttons">
            <a href="/login?role=volunteer" className="btn btn-primary">
              Login as Volunteer
            </a>
            <a href="/login?role=ngo" className="btn btn-green">
              Login as NGO
            </a>
          </div>
        </div>

        <div className="sb-hero-image">
          {/* Optional image */}
        </div>
      </div>
    </section>
  );
}
