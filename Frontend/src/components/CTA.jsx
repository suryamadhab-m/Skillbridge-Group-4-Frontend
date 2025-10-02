// src/components/CTA.jsx
/*import React from "react";
import './components.css'; // Make sure to import the CSS for styling

const CTA = () => {
  return (
    <section id="cta" className="cta-section">
      <div className="cta-container">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of volunteers and NGOs already making a difference through SkillBridge.</p>
        <div className="cta-buttons">
          <button className="cta-volunteer">Sign Up as Volunteer</button>
          <button className="cta-ngo">Sign Up as NGO</button>
        </div>
      </div>
    </section>
  );
};

export default CTA;*/
import React from "react";
import { useNavigate } from "react-router-dom";
import './components.css';

const CTA = () => {
  const navigate = useNavigate();

  const handleVolunteerSignup = () => {
    navigate("/register?role=volunteer");
  };

  const handleNGOSignup = () => {
    navigate("/register?role=ngo");
  };

  return (
    <section id="cta" className="cta-section">
      <div className="cta-container">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of volunteers and NGOs already making a difference through SkillBridge.</p>
        <div className="cta-buttons">
          <button className="cta-volunteer" onClick={handleVolunteerSignup}>
            Sign Up as Volunteer
          </button>
          <button className="cta-ngo" onClick={handleNGOSignup}>
            Sign Up as NGO
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
